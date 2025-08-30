import { useParams } from "react-router-dom";
import { Loader, Error } from "@/common";

import { useGetAnimeDetailsQuery } from "@/services/TMDB";

const AnimeDetails = () => {
  const { id } = useParams();

  const {
    data: anime,
    isLoading,
    isError,
    error,
  } = useGetAnimeDetailsQuery(id || "");

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Sorry, anime details are not available right now.
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This may be a problem with the anime API server. Try again later or
            select a different anime.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Anime Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            The requested anime could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={anime.coverImage?.large || anime.coverImage?.medium}
                alt={anime.title?.english || anime.title?.romaji}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {anime.title?.english || anime.title?.romaji}
              </h1>

              {anime.title?.english &&
                anime.title?.romaji &&
                anime.title.english !== anime.title.romaji && (
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {anime.title.romaji}
                  </p>
                )}

              <div className="flex flex-wrap gap-2 mb-4">
                {anime.genres?.map((genre: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Type
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {anime.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Format
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {anime.format}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Episodes
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {anime.episodes || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Duration
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {anime.duration || "Unknown"} min
                  </p>
                </div>
              </div>

              {anime.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {anime.description.replace(/<[^>]*>/g, "")}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4">
                {anime.averageScore && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Score:
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {anime.averageScore / 10}/10
                    </span>
                  </div>
                )}
                {anime.popularity && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Popularity:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      #{anime.popularity}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
