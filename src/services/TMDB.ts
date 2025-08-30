import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_KEY } from "@/utils/config";

const TMDB_API_BASE_URL =
  "https://proxy-api-server-woz1.onrender.com/v1/tmdb/3";

console.log("TMDB API Config:", { TMDB_API_BASE_URL, API_KEY });

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: TMDB_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getShows: builder.query({
      query: ({
        category,
        type,
        searchQuery,
        page,
        showSimilarShows,
        id,
        providerId,
      }: {
        category: string | undefined;
        type?: string;
        page?: number;
        searchQuery?: string;
        showSimilarShows?: boolean;
        id?: number;
        providerId?: number;
      }) => {
        const params = new URLSearchParams();
        params.append("api_key", API_KEY);

        if (page) params.append("page", page.toString());
        if (searchQuery) params.append("query", searchQuery);

        let url = "";

        if (searchQuery) {
          url = `search/${category}?${params.toString()}`;
        } else if (showSimilarShows) {
          url = `${category}/${id}/similar?${params.toString()}`;
        } else if (category === "streaming" && providerId) {
          params.append("with_watch_providers", providerId.toString());
          params.append("watch_region", "IN");
          params.append("region", "IN");
          params.append("sort_by", "popularity.desc");

          url = `discover/${
            type === "netflix" || type === "prime" || type === "appletv"
              ? "movie"
              : "tv"
          }?${params.toString()}`;
        } else {
          url = `${category}/${type}?${params.toString()}`;
        }

        console.log("API Request URL:", `${TMDB_API_BASE_URL}/${url}`);
        return url;
      },
      transformErrorResponse: (response: { status: number; data: any }) => {
        console.error("API Error Response:", response);
        return {
          status: response.status,
          data: response.data,
          message: `API Error: ${response.status} - ${
            response.data?.status_message || "Unknown error"
          }`,
        };
      },
    }),

    getShow: builder.query({
      query: ({ category, id }: { category: string; id: number }) => {
        const params = new URLSearchParams();
        params.append("api_key", API_KEY);
        params.append("append_to_response", "videos,credits");
        // Use correct endpoint for details
        let endpoint = "";
        if (category === "movie" || category === "tv") {
          endpoint = `${category}/${id}?${params.toString()}`;
        } else {
          // fallback: try movie, then tv
          endpoint = `movie/${id}?${params.toString()}`;
        }
        return endpoint;
      },
    }),

    getAnime: builder.query({
      query: () => ({
        url: "https://api-consumet-ten-delta.vercel.app/meta/anilist/trending",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.results || [];
      },
      transformErrorResponse: (response: { status: number; data: any }) => {
        return {
          status: response.status,
          data: response.data,
          message: `Anime API Error: ${response.status} - Unable to fetch anime data`,
        };
      },
    }),

    getAnimeDetails: builder.query({
      query: (id: string) =>
        `https://api-consumet-ten-delta.vercel.app/meta/anilist/info/${id}`,
      transformErrorResponse: (response: any) => ({
        message: `Anime Details API Error: ${response.status} - Unable to fetch anime details`,
      }),
    }),
  }),
});

export const {
  useGetShowsQuery,
  useGetShowQuery,
  useGetAnimeQuery,
  useGetAnimeDetailsQuery,
} = tmdbApi;
