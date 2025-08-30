import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { m } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";

import { MovieCard, Loader, Error } from "@/common";
import { maxWidth } from "@/styles";
import { cn } from "@/utils/helper";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  const API_KEY = "374ed57246cdd0d51e7f9c7eb9e682f0";
  const BASE_URL = "/tmdb";

  const searchContent = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}&page=${page}&include_adult=false`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();

      // Filter results to only include movies and TV shows with posters
      const filteredResults = data.results.filter(
        (item: any) =>
          (item.media_type === "movie" || item.media_type === "tv") &&
          item.poster_path
      );

      if (page === 1) {
        setResults(filteredResults);
      } else {
        setResults((prev) => [...prev, ...filteredResults]);
      }

      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      setResults([]);
      setCurrentPage(1);
      searchContent(query, 1);
    }
  }, [query]);

  const loadMore = () => {
    if (query && currentPage < totalPages) {
      searchContent(query, currentPage + 1);
    }
  };

  const filteredResults = results.filter((item) => {
    if (filter === "all") return true;
    return item.media_type === filter;
  });

  const movieCount = results.filter(
    (item) => item.media_type === "movie"
  ).length;
  const tvCount = results.filter((item) => item.media_type === "tv").length;

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className={cn(maxWidth, "py-8 md:py-16 px-4")}>
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <FaSearch className="text-white text-lg md:text-2xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
              No Search Query
            </h1>
            <p className="text-gray-400 text-base md:text-lg">
              Please enter a search term to find movies and TV shows.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && results.length === 0) {
    return <Loader />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20 md:pt-24">
      <div className={cn(maxWidth, "py-8 md:py-16 px-4")}>
        {/* Enhanced Header */}
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <FaSearch className="text-white text-sm md:text-lg" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              Search Results
            </h1>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700">
            <h2 className="text-lg md:text-2xl font-semibold text-white mb-2">
              "{query}"
            </h2>
            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-gray-300 text-sm md:text-base">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {filteredResults.length}{" "}
                {filteredResults.length === 1 ? "result" : "results"}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {movieCount} movies
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                {tvCount} TV shows
              </span>
            </div>
          </div>
        </m.div>

        {/* Filter Tabs */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <FaFilter className="text-gray-400 text-sm md:text-base" />
            <span className="text-gray-300 font-medium text-sm md:text-base">
              Filter by:
            </span>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-200 text-sm md:text-base",
                filter === "all"
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/25"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
              )}
            >
              All ({results.length})
            </button>
            <button
              onClick={() => setFilter("movie")}
              className={cn(
                "px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-200 text-sm md:text-base",
                filter === "movie"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
              )}
            >
              Movies ({movieCount})
            </button>
            <button
              onClick={() => setFilter("tv")}
              className={cn(
                "px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-200 text-sm md:text-base",
                filter === "tv"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
              )}
            >
              TV Shows ({tvCount})
            </button>
          </div>
        </m.div>

        {/* Results Grid */}
        {filteredResults.length > 0 ? (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6"
            >
              {filteredResults.map((item, index) => (
                <m.div
                  key={`${item.media_type}-${item.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <MovieCard
                    movie={{
                      ...item,
                      title: item.title || item.name,
                      release_date: item.release_date || item.first_air_date,
                    }}
                    category={item.media_type}
                  />
                </m.div>
              ))}
            </m.div>

            {/* Enhanced Load More Button */}
            {currentPage < totalPages && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center"
              >
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Loading more results...
                    </div>
                  ) : (
                    `Load More (${totalPages - currentPage} pages remaining)`
                  )}
                </button>
              </m.div>
            )}
          </>
        ) : (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSearch className="text-gray-400 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              No Results Found
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              No{" "}
              {filter === "all"
                ? "movies or TV shows"
                : filter === "movie"
                ? "movies"
                : "TV shows"}{" "}
              found for "{query}". Try a different search term or check your
              spelling.
            </p>
          </m.div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
