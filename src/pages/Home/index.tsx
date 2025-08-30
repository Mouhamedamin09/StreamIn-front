import { Loader, Error, Section, Search } from "@/common";
import { Hero } from "./components";

import { useGetShowsQuery } from "@/services/TMDB";
import { maxWidth } from "@/styles";
import { sections } from "@/constants";
import { cn } from "@/utils/helper";

const Home = () => {
  const { data, isLoading, isError, error } = useGetShowsQuery({
    category: "movie",
    type: "popular",
    page: 1,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    console.error("API Error:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Unable to fetch the movies!
          </h2>
          <p className="text-gray-600 mb-4">
            Please check your internet connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const popularMovies = data?.results?.slice(0, 5) || [];

  return (
    <>
      <Hero movies={popularMovies} />

      {/* Search Bar - Outside of carousel */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 md:py-16">
        <div className={cn(maxWidth, "px-4")}>
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-4">
              Find Your Favorite Movies & TV Shows
            </h2>
            <p className="text-gray-400 text-sm md:text-lg">
              Search through thousands of movies and TV series
            </p>
          </div>
          <Search />
        </div>
      </div>

      <div className={cn(maxWidth, "lg:mt-12 md:mt-8 sm:mt-6 xs:mt-4 mt-2")}>
        {sections
          .filter(({ category }) => category !== "anime")
          .map(({ title, category, type, providerId }) => (
            <Section
              title={title}
              category={category}
              type={type}
              providerId={providerId}
              key={title}
            />
          ))}
      </div>
    </>
  );
};

export default Home;
