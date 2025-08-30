// Fallbacks so the app works out-of-the-box if env vars are not set
// Use Vite proxy for TMDB API to avoid CORS issues
const FALLBACK_TMDB_BASE = "/tmdb";
const FALLBACK_API_KEY = "374ed57246cdd0d51e7f9c7eb9e682f0";

export const TMDB_API_BASE_URL: string =
  import.meta.env.VITE_TMDB_API_BASE_URL || FALLBACK_TMDB_BASE;
export const API_KEY: string = import.meta.env.VITE_API_KEY || FALLBACK_API_KEY;

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
export const GOOGLE_AD_SLOT = import.meta.env.VITE_GOOGLE_AD_SLOT;
export const GOOGLE_AD_CLIENT = import.meta.env.VITE_GOOGLE_AD_CLIENT;

export const THROTTLE_DELAY = 150;
