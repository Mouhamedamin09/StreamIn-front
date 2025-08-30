# StreamIn Analytics Setup Guide

## 🚀 Complete Analytics System for StreamIn

This system provides **anonymous user tracking** without requiring login/signup, perfect for a streaming platform. You'll get insights into:

- 👀 **View counts** and popular content
- 🌍 **Geographic distribution** of viewers
- 📊 **Real-time activity** and user behavior
- 📱 **Device analytics** (mobile vs desktop)
- ⏱️ **Streaming statistics** and completion rates

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🛠️ Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/streamin-analytics
NODE_ENV=development
```

### 2. Start MongoDB

**Local MongoDB:**

```bash
mongod
```

**Or use MongoDB Atlas (Cloud):**

1. Create account at https://mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 3. Start Backend Server

```bash
npm run dev
```

The analytics server will run on `http://localhost:5000`

### 4. Frontend Integration

The analytics tracking is already integrated into your React app. Just add the environment variable:

Create `.env.local` in your frontend root:

```env
VITE_ANALYTICS_URL=http://localhost:5000
```

### 5. Start Frontend

```bash
# In the main project directory
npm run dev
```

## 📊 Access Admin Dashboard

Visit: `http://localhost:3000/admin` (or your frontend URL + /admin)

## 🔧 What Gets Tracked

### 📈 **Page Views**

- Every page visit
- Session duration
- Navigation patterns

### 🎬 **Video Activity**

- Movie/TV show starts
- Server selection changes
- Episode selections (for TV shows)
- Video progress milestones (25%, 50%, 75%, 100%)

### 🔍 **Search Activity**

- Search queries
- Search result counts
- Popular search terms

### 🌐 **User Context**

- Geographic location (country/city)
- Device type (mobile/tablet/desktop)
- Browser information
- Session management

### ⚠️ **Errors**

- Video loading failures
- API errors
- User experience issues

## 🔐 Privacy Features & Research Data

### Basic Analytics (Anonymous)

- ✅ **Session-based** tracking (temporary IDs)
- ✅ **IP anonymization** (no storing full IPs)
- ✅ **Geo-data limited** to country/city level
- ✅ **User can disable** tracking
- ✅ **GDPR compliant** approach

### Research Data Collection (With Consent)

- ✅ **Explicit user consent** required for all personal data
- ✅ **Optional participation** - users can skip or participate
- ✅ **Transparent data usage** - clear explanation of research purposes
- ✅ **Granular consent** - separate permissions for data collection, research participation, and contact
- ✅ **Data export capabilities** for researchers
- ✅ **Secure storage** with the same privacy standards

### Research Data Collected (Optional)

- **Demographics**: Age, gender, occupation, education level, income range, location
- **Interests**: User-selected interests and hobbies
- **Streaming Habits**: Daily hours, preferred times, favorite genres, device preferences
- **Contact Information**: Email (only if user consents to follow-up studies)

## 📊 Dashboard Features

### **Real-time Metrics**

- Current active users
- Live activity feed
- Recent content views

### **Analytics Overview**

- Total views and trends
- Daily/monthly statistics
- Growth rates

### **Popular Content**

- Most watched movies
- Top TV shows
- Trending anime

### **Geographic Insights**

- Top countries by views
- Regional preferences
- Global distribution

### **Device Analytics**

- Mobile vs desktop usage
- Browser statistics
- Platform preferences

### **Research Analytics** (New!)

- Demographics breakdown (age groups, gender, education)
- Streaming behavior patterns and preferences
- User interests and hobby analysis
- Consent and participation rates
- Participant contact management
- CSV data export for research analysis

## 🚀 Production Deployment

### Backend (Node.js)

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
ALLOWED_ORIGINS=https://yourdomain.com
```

### Database Indexing (for better performance)

```javascript
// Run in MongoDB shell
db.analytics.createIndex({ timestamp: -1 });
db.analytics.createIndex({ sessionId: 1 });
db.analytics.createIndex({ event: 1 });
db.analytics.createIndex({ "data.movieId": 1 });
```

## 📈 Scaling Considerations

### For High Traffic:

1. **Use Redis** for session storage instead of in-memory Map
2. **Database Sharding** for large datasets
3. **CDN** for static dashboard assets
4. **Load Balancer** for multiple backend instances

### Redis Session Storage:

```bash
npm install redis
```

Update `server.js` to use Redis instead of Map for sessions.

## 🔧 Customization

### Add Custom Events

```javascript
// In your React components
import analytics from "@/utils/analytics";

// Track custom events
analytics.track("custom_event", {
  customData: "value",
  userId: "optional_user_id",
});
```

### Custom Dashboard Widgets

Add new widgets to `Dashboard.tsx`:

```tsx
const CustomWidget = () => {
  // Your custom analytics display
};
```

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**

   - Check `ALLOWED_ORIGINS` in backend `.env`
   - Ensure frontend URL is allowed

2. **Database Connection Failed**

   - Verify MongoDB is running
   - Check connection string in `.env`

3. **Analytics Not Tracking**

   - Check browser console for errors
   - Verify `VITE_ANALYTICS_URL` is set correctly

4. **Dashboard Not Loading**
   - Ensure backend is running on port 5000
   - Check API endpoints are accessible

## 📞 Support

If you need help:

1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Check that ports 3000 and 5000 are available

## 🎯 Next Steps

1. **Set up monitoring** for the analytics system itself
2. **Add email alerts** for high traffic or errors
3. **Create automated reports** (daily/weekly summaries)
4. **Implement data retention policies** (auto-delete old data)
5. **Add A/B testing capabilities**

---

**🎉 Congratulations!** You now have a complete, privacy-friendly analytics system that will give you valuable insights into your StreamIn platform without compromising user privacy.
