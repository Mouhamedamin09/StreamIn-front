import { Link } from "react-router-dom";

import Image from "../Image";
import { IMovie } from "@/types";

const MovieCard = ({
  movie,
  category,
}: {
  movie: IMovie;
  category: string;
}) => {
  const { poster_path, original_title: title, name, id } = movie;
  return (
    <div className="flex flex-col w-full">
      <Link
        to={`/${category}/${id}`}
        className="dark:bg-[#1f1f1f] bg-[#f5f5f5] rounded-lg relative group w-full select-none aspect-[2/3] overflow-hidden block"
      >
        <Image
          height={300}
          width={200}
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          alt={movie.original_title}
          className="w-full h-full object-cover rounded-lg drop-shadow-md shadow-md group-hover:shadow-none group-hover:drop-shadow-none transition-all duration-300 ease-in-out"
          effect="zoomIn"
        />

        <div className="absolute top-0 left-0 w-full h-full group-hover:opacity-100 opacity-0 bg-[rgba(0,0,0,0.6)] transition-all duration-300 rounded-lg flex items-center justify-center">
          <img
            src="/play.png"
            alt="Play"
            className="w-8 h-8 md:w-12 md:h-12 scale-[0.4] group-hover:scale-100 transition-all duration-300"
          />
        </div>
      </Link>

      <h4 className="dark:text-gray-300 text-center cursor-default text-xs sm:text-sm md:text-base font-medium mt-2 px-1 line-clamp-2">
        {(title?.length > 50 ? title.split(":")[0] : title) || name}
      </h4>
    </div>
  );
};

export default MovieCard;
