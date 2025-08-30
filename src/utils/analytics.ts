// Analytics tracking utility
class Analytics {
  private baseURL: string;
  private sessionId: string | null = null;
  private isEnabled: boolean = true;

  constructor() {
    // Use environment variable or default to local development
    this.baseURL =
      import.meta.env.VITE_ANALYTICS_URL ||
      "https://streamin-server-feyfo.ondigitalocean.app";
    this.initSession();
  }

  private async initSession() {
    try {
      // Get existing session ID from localStorage or create new one
      this.sessionId = localStorage.getItem("streamin_session_id");

      if (!this.sessionId) {
        // Generate new session on first visit
        this.sessionId = this.generateSessionId();
        localStorage.setItem("streamin_session_id", this.sessionId);
      }

      // Update last activity
      localStorage.setItem("streamin_last_activity", Date.now().toString());
    } catch (error) {
      console.warn("Analytics session init failed:", error);
      this.isEnabled = false;
    }
  }

  private generateSessionId(): string {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  private async track(event: string, data: any = {}) {
    if (!this.isEnabled || !this.sessionId) return;

    try {
      await fetch(`${this.baseURL}/api/analytics/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": this.sessionId,
        },
        body: JSON.stringify({
          event,
          data: {
            ...data,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer,
          },
        }),
      });

      // Update last activity
      localStorage.setItem("streamin_last_activity", Date.now().toString());
    } catch (error) {
      console.warn("Analytics tracking failed:", error);
    }
  }

  // Page view tracking
  trackPageView(page: string, additionalData: any = {}) {
    this.track("page_view", {
      page,
      title: document.title,
      ...additionalData,
    });
  }

  // Video/streaming tracking
  trackVideoStart(
    movieId: string,
    movieTitle: string,
    category: "movie" | "tv" | "anime",
    server: string,
    additionalData: any = {}
  ) {
    this.track("video_start", {
      movieId,
      movieTitle,
      category,
      server,
      ...additionalData,
    });
  }

  trackVideoEnd(
    movieId: string,
    movieTitle: string,
    category: "movie" | "tv" | "anime",
    duration: number,
    progress: number,
    additionalData: any = {}
  ) {
    this.track("video_end", {
      movieId,
      movieTitle,
      category,
      duration,
      progress,
      ...additionalData,
    });
  }

  trackVideoProgress(movieId: string, progress: number, duration: number) {
    // Only track progress at 25%, 50%, 75%, 100%
    const milestones = [25, 50, 75, 100];
    const currentMilestone = milestones.find(
      (m) => progress >= m && progress < m + 5 // 5% tolerance
    );

    if (currentMilestone) {
      this.track("video_progress", {
        movieId,
        progress: currentMilestone,
        duration,
      });
    }
  }

  // Search tracking
  trackSearch(query: string, results: number) {
    this.track("search", {
      query,
      results,
    });
  }

  // Content interaction tracking
  trackContentClick(
    movieId: string,
    movieTitle: string,
    category: string,
    action: string = "click"
  ) {
    this.track("content_interaction", {
      movieId,
      movieTitle,
      category,
      action,
    });
  }

  // Server selection tracking
  trackServerChange(movieId: string, fromServer: string, toServer: string) {
    this.track("server_change", {
      movieId,
      fromServer,
      toServer,
    });
  }

  // Episode/season tracking for TV shows
  trackEpisodeSelect(movieId: string, season: number, episode: number) {
    this.track("episode_select", {
      movieId,
      season,
      episode,
    });
  }

  // Error tracking
  trackError(error: string, context: string, additionalData: any = {}) {
    this.track("error", {
      error,
      context,
      userAgent: navigator.userAgent,
      ...additionalData,
    });
  }

  // Feature usage tracking
  trackFeatureUse(feature: string, data: any = {}) {
    this.track("feature_use", {
      feature,
      ...data,
    });
  }

  // Session management
  updateActivity() {
    localStorage.setItem("streamin_last_activity", Date.now().toString());
  }

  // Check if user has been inactive (for session timeout)
  isSessionActive(): boolean {
    const lastActivity = localStorage.getItem("streamin_last_activity");
    if (!lastActivity) return false;

    const inactiveTime = Date.now() - parseInt(lastActivity);
    return inactiveTime < 30 * 60 * 1000; // 30 minutes
  }

  // Get session info
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      lastActivity: localStorage.getItem("streamin_last_activity"),
      isActive: this.isSessionActive(),
    };
  }

  // Enable/disable tracking
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    localStorage.setItem("streamin_analytics_enabled", enabled.toString());
  }

  // Privacy: Clear all tracking data
  clearTrackingData() {
    localStorage.removeItem("streamin_session_id");
    localStorage.removeItem("streamin_last_activity");
    localStorage.removeItem("streamin_analytics_enabled");

    this.sessionId = null;
    this.isEnabled = false;
  }
}

// Create singleton instance
const analytics = new Analytics();

// Auto-track page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    analytics.updateActivity();
  }
});

// Auto-track page unload
window.addEventListener("beforeunload", () => {
  analytics.trackPageView("page_unload", {
    duration:
      Date.now() -
      parseInt(localStorage.getItem("streamin_last_activity") || "0"),
  });
});

export default analytics;
