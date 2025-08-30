import { memo, FC, useRef } from "react";
import { Link } from "react-router-dom";
import { useInView } from "framer-motion";

import MoviesSlides from "./MoviesSlides";
import { SkelatonLoader } from "../Loader";
import Error from "../Error";

import { useGetShowsQuery, useGetAnimeQuery } from "@/services/TMDB";
import { useTheme } from "@/context/themeContext";
import { cn, getErrorMessage } from "@/utils/helper";

interface SectionProps {
  title: string;
  category: string;
  className?: string;
  type?: string;
  id?: number;
  showSimilarShows?: boolean;
  providerId?: number;
}

const Section: FC<SectionProps> = ({
  title,
  category,
  className,
  type,
  id,
  showSimilarShows,
  providerId,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    margin: "420px",
    once: true,
  });

  const { theme } = useTheme();

  const {
    data = { results: [] },
    isLoading,
    isError,
    error,
  } = useGetShowsQuery(
    {
      category,
      type,
      page: 1,
      showSimilarShows,
      id,
      providerId,
    },
    {
      skip: !inView || category === "anime",
    }
  );

  const {
    data: animeData = [],
    isLoading: animeLoading,
    isError: animeError,
    error: animeErrorData,
  } = useGetAnimeQuery(undefined, {
    skip: !inView || category !== "anime",
  });

  const errorMessage = isError ? getErrorMessage(error) : "";
  const animeErrorMessage = animeError ? getErrorMessage(animeErrorData) : "";

  const sectionStyle = cn(
    `sm:py-[20px] xs:py-[18.75px] py-[16.75px] font-nunito`,
    className
  );
  const linkStyle = cn(
    `sm:py-1 py-[2px] sm:text-[14px] xs:text-[12.75px] text-[12px] sm:px-4 px-3 rounded-full  dark:text-gray-300 hover:-translate-y-1 transition-all duration-300`,
    theme === "Dark" ? "view-all-btn--dark" : "view-all-btn--light"
  );

  const isAnime = category === "anime";
  const currentData = isAnime ? animeData : data.results;
  const currentLoading = isAnime ? animeLoading : isLoading;
  const currentError = isAnime ? animeError : isError;
  const currentErrorMessage = isAnime ? animeErrorMessage : errorMessage;

  const isResourceNotFound =
    typeof currentErrorMessage === "string" &&
    currentErrorMessage.includes('status_code":34');

  return (
    <section className={sectionStyle} ref={ref}>
      <div className="flex flex-row justify-between items-center mb-[22.75px]">
        <div className=" relative">
          <h3 className="sm:text-[22.25px] xs:text-[20px] text-[18.75px] dark:text-gray-50 sm:font-bold font-semibold">
            {title}
          </h3>
          <div className="line" />
        </div>
        {!showSimilarShows && (
          <Link to={`/${category}?type=${type}`} className={linkStyle}>
            View all
          </Link>
        )}
      </div>
      <div className="sm:h-[350px] xs:h-[340px] h-[300px] pb-8">
        {currentLoading ? (
          <SkelatonLoader />
        ) : currentError && !isResourceNotFound ? (
          <Error
            error={String(currentErrorMessage)}
            className="h-full text-[18px]"
          />
        ) : isResourceNotFound ? null : (
          <MoviesSlides movies={currentData.slice(0, 10)} category={category} />
        )}
      </div>
    </section>
  );
};

export default memo(Section);
