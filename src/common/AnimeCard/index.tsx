import { Link } from "react-router-dom";

import Image from "../Image";

interface IAnime {
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

const AnimeCard = ({ anime }: { anime: IAnime }) => {
  const { coverImage, title, id } = anime;

  // Use medium image if large is not available
  const imageUrl = coverImage?.large || coverImage?.medium;

  return (
    <div className="flex flex-col w-full">
      <Link
        to={`/anime/${id}`}
        className="dark:bg-[#1f1f1f] bg-[#f5f5f5] rounded-lg relative group w-full select-none aspect-[2/3] overflow-hidden block"
      >
        {imageUrl ? (
          <Image
            height={300}
            width={200}
            src={imageUrl}
            alt={title?.english || title?.romaji}
            className="w-full h-full object-cover rounded-lg drop-shadow-md shadow-md group-hover:shadow-none group-hover:drop-shadow-none transition-all duration-300 ease-in-out"
            effect="zoomIn"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-12 h-12 md:w-16 md:h-16 text-gray-500"
              fill="currentColor"
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        )}
        <div className="absolute top-0 left-0 w-full h-full group-hover:opacity-100 opacity-0 bg-[rgba(0,0,0,0.6)] transition-all duration-300 rounded-lg flex items-center justify-center">
          <img
            src="/play.png"
            alt="Play"
            className="w-8 h-8 md:w-12 md:h-12 scale-[0.4] group-hover:scale-100 transition-all duration-300"
          />
        </div>
      </Link>

      <h4 className="dark:text-gray-300 text-center cursor-default text-xs sm:text-sm md:text-base font-medium mt-2 px-1 line-clamp-2">
        {(title?.english || title?.romaji)?.length > 50
          ? (title?.english || title?.romaji)?.split(":")[0]
          : title?.english || title?.romaji}
      </h4>
    </div>
  );
};

export default AnimeCard;
