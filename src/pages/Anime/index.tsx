import { useState, useEffect } from "react";
import { m } from "framer-motion";

import { AnimeCard, Loader, Error } from "@/common";
import { maxWidth } from "@/styles";
import { cn } from "@/utils/helper";

interface Anime {
  id: string;
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  type: string;
  format: string;
  status: string;
  episodes: number;
  duration: number;
  season: string;
  seasonYear: number;
  description: string;
  genres: string[];
  averageScore: number;
  popularity: number;
  trending: number;
  favourites: number;
  countryOfOrigin: string;
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
  };
}

const Anime = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState("POPULARITY_DESC");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryOptions = [
    { value: "POPULARITY_DESC", label: "Most Popular" },
    { value: "TRENDING", label: "Trending" },
    { value: "SCORE_DESC", label: "Top Rated" },
    { value: "UPDATED_AT_DESC", label: "Recently Updated" },
    { value: "START_DATE_DESC", label: "Newest" },
  ];

  const fetchAnime = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // This would need to be implemented with your anime API
      // For now, using a placeholder
      const response = await fetch(
        `/api/anime?category=${category}&page=${currentPage}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch anime");
      }

      const data = await response.json();
      setAnimeList(data.animes || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching anime:", err);
      setError("Failed to load anime. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime();
  }, [currentPage, category]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  if (isLoading && animeList.length === 0) {
    return <Loader />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24">
      <div className={cn(maxWidth, "py-16")}>
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Anime</h1>

          {/* Filter Tabs */}
          <div className="flex gap-3 flex-wrap">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleCategoryChange(option.value)}
                className={cn(
                  "px-6 py-3 rounded-xl font-semibold transition-all duration-200",
                  category === option.value
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/25"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </m.div>

        {/* Anime Grid */}
        {animeList.length > 0 ? (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              {animeList.map((anime, index) => (
                <m.div
                  key={anime.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <AnimeCard anime={anime} />
                </m.div>
              ))}
            </m.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center"
              >
                <div className="flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={cn(
                          "px-4 py-2 rounded-lg font-semibold transition-all duration-200",
                          currentPage === page
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
                        )}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
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
              <span className="text-gray-400 text-3xl">🎌</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              No Anime Found
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              No anime found for the selected category. Try a different filter.
            </p>
          </m.div>
        )}
      </div>
    </div>
  );
};

export default Anime;
