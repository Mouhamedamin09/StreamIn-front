const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const geoip = require("geoip-lite");
const useragent = require("express-useragent");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 8080;
const path = require("path");
dotenv.config();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["http://159.89.137.41", "http://localhost:3000"]
        : ["http://localhost:3000", "http://localhost:5173"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(useragent.express());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP",
});
app.use("/api/", limiter);

// MongoDB connection
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/streamin-analytics",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Analytics Schema (simplified - removed research data)
const AnalyticsSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    event: { type: String, required: true }, // 'page_view', 'video_start', 'video_end', etc.
    data: {
      movieId: String,
      movieTitle: String,
      category: String, // 'movie', 'tv', 'anime'
      query: String, // for search events
      page: String, // for page_view events
      server: String, // for video events
      season: Number, // for TV shows
      episode: Number, // for TV shows
      duration: Number, // video duration in seconds
      progress: Number, // watch progress percentage
      error: String, // for error tracking
      feature: String, // for feature usage tracking
      action: String, // generic action field
      referrer: String,
      url: String,
      title: String,
    },
    userAgent: {
      browser: String,
      version: String,
      os: String,
      platform: String,
      isMobile: Boolean,
      isDesktop: Boolean,
      isTablet: Boolean,
    },
    location: {
      ip: String,
      country: String,
      region: String,
      city: String,
      timezone: String,
      ll: [Number], // [latitude, longitude]
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Analytics = mongoose.model("Analytics", AnalyticsSchema);

// Session tracking
const activeSessions = new Map();

// Session middleware
app.use((req, res, next) => {
  const sessionId = req.headers["x-session-id"];
  if (sessionId) {
    req.sessionId = sessionId;
    activeSessions.set(sessionId, Date.now());
  } else {
    req.sessionId = uuidv4();
  }
  next();
});

// Helper function to get location data from IP
function getLocationData(ip) {
  if (ip && ip !== "::1" && ip !== "127.0.0.1") {
    const geo = geoip.lookup(ip);
    if (geo) {
      return {
        ip: ip,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        timezone: geo.timezone,
        ll: geo.ll,
      };
    }
  }
  return null;
}

// Analytics tracking endpoint
app.post("/api/analytics/track", async (req, res) => {
  try {
    const { event, data } = req.body;

    const analyticsData = new Analytics({
      sessionId: req.sessionId,
      event,
      data,
      userAgent: {
        browser: req.useragent.browser,
        version: req.useragent.version,
        os: req.useragent.os,
        platform: req.useragent.platform,
        isMobile: req.useragent.isMobile,
        isDesktop: req.useragent.isDesktop,
        isTablet: req.useragent.isTablet,
      },
      location: getLocationData(
        req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress
      ),
      ip: (
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress
      ).replace(/^.*:/, ""),
    });

    await analyticsData.save();

    res.status(200).json({
      success: true,
      sessionId: req.sessionId,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to track analytics" });
  }
});

// Admin API Routes

// Overview statistics
app.get("/api/admin/stats/overview", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [overview, topCountries] = await Promise.all([
      Analytics.aggregate([
        {
          $facet: {
            total: [
              {
                $group: {
                  _id: null,
                  totalViews: {
                    $sum: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] },
                  },
                  totalSearches: {
                    $sum: { $cond: [{ $eq: ["$event", "search"] }, 1, 0] },
                  },
                  uniqueUsers: { $addToSet: "$sessionId" },
                  totalVideoStarts: {
                    $sum: { $cond: [{ $eq: ["$event", "video_start"] }, 1, 0] },
                  },
                },
              },
              {
                $project: {
                  totalViews: 1,
                  totalSearches: 1,
                  uniqueUsers: { $size: "$uniqueUsers" },
                  totalVideoStarts: 1,
                },
              },
            ],
            today: [
              { $match: { timestamp: { $gte: today } } },
              {
                $group: {
                  _id: null,
                  todayViews: {
                    $sum: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] },
                  },
                  todaySearches: {
                    $sum: { $cond: [{ $eq: ["$event", "search"] }, 1, 0] },
                  },
                  todayUsers: { $addToSet: "$sessionId" },
                  todayVideoStarts: {
                    $sum: { $cond: [{ $eq: ["$event", "video_start"] }, 1, 0] },
                  },
                },
              },
              {
                $project: {
                  todayViews: 1,
                  todaySearches: 1,
                  todayUsers: { $size: "$todayUsers" },
                  todayVideoStarts: 1,
                },
              },
            ],
          },
        },
      ]),

      // Top countries
      Analytics.aggregate([
        { $match: { "location.country": { $exists: true } } },
        { $group: { _id: "$location.country", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, country: "$_id", views: 1 } },
      ]),
    ]);

    const stats = {
      totalViews: overview[0].total[0]?.totalViews || 0,
      todayViews: overview[0].today[0]?.todayViews || 0,
      totalSearches: overview[0].total[0]?.totalSearches || 0,
      todaySearches: overview[0].today[0]?.todaySearches || 0,
      uniqueUsers: overview[0].total[0]?.uniqueUsers || 0,
      todayUsers: overview[0].today[0]?.todayUsers || 0,
      totalVideoStarts: overview[0].total[0]?.totalVideoStarts || 0,
      todayVideoStarts: overview[0].today[0]?.todayVideoStarts || 0,
    };

    res.json({
      overview: stats,
      topCountries,
    });
  } catch (error) {
    console.error("Overview stats error:", error);
    res.status(500).json({ error: "Failed to fetch overview statistics" });
  }
});

// Popular content
app.get("/api/admin/stats/popular-content", async (req, res) => {
  try {
    const popularContent = await Analytics.aggregate([
      {
        $match: {
          "data.movieId": { $exists: true },
          "data.movieTitle": { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            movieId: "$data.movieId",
            movieTitle: "$data.movieTitle",
            category: "$data.category",
          },
          views: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$event",
                    ["page_view", "video_start", "content_interaction"],
                  ],
                },
                1,
                0,
              ],
            },
          },
          searches: {
            $sum: { $cond: [{ $eq: ["$event", "search"] }, 1, 0] },
          },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          movieId: "$_id.movieId",
          movieTitle: "$_id.movieTitle",
          category: "$_id.category",
          views: 1,
          searches: 1,
        },
      },
    ]);

    res.json(popularContent);
  } catch (error) {
    console.error("Popular content error:", error);
    res.status(500).json({ error: "Failed to fetch popular content" });
  }
});

// Real-time activity
app.get("/api/admin/stats/realtime", async (req, res) => {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const [recentActivity, activeUsers] = await Promise.all([
      Analytics.find({
        timestamp: { $gte: fifteenMinutesAgo },
        event: { $in: ["video_start", "search", "page_view"] },
      })
        .sort({ timestamp: -1 })
        .limit(50)
        .select("event data location timestamp"),

      Analytics.distinct("sessionId", {
        timestamp: { $gte: fifteenMinutesAgo },
      }),
    ]);

    res.json({
      currentWatching: recentActivity,
      activeUsers: activeUsers.length,
    });
  } catch (error) {
    console.error("Real-time stats error:", error);
    res.status(500).json({ error: "Failed to fetch real-time stats" });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Serve static files from the dist folder (React frontend)
if (process.env.NODE_ENV === "production") {
  // Serve static files
  app.use(express.static(path.join(__dirname, "../dist")));

  // Handle React Router - serve index.html for all routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
  });
}

// Clean up inactive sessions periodically
setInterval(() => {
  const now = Date.now();
  const thirtyMinutesAgo = now - 30 * 60 * 1000;

  for (const [sessionId, lastActivity] of activeSessions.entries()) {
    if (lastActivity < thirtyMinutesAgo) {
      activeSessions.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Analytics server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
