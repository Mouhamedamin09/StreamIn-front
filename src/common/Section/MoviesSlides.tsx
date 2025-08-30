import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";

import MovieCard from "../MovieCard";
import AnimeCard from "../AnimeCard";
import { IMovie } from "@/types";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Install Swiper modules
SwiperCore.use([Navigation, Pagination, Autoplay]);

interface MoviesSlidesProps {
  movies: IMovie[] | any[];
  category: string;
}

const MoviesSlides: FC<MoviesSlidesProps> = ({ movies, category }) => (
  <div className="flex justify-center">
    <Swiper
      slidesPerView="auto"
      spaceBetween={15}
      navigation={true}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop={false}
      className="mySwiper w-full max-w-6xl"
      centeredSlides={true}
      centeredSlidesBounds={true}
    >
      {movies.map((item) => {
        return (
          <SwiperSlide
            key={item.id}
            style={{
              width: "auto",
              maxWidth: "170px",
            }}
            className="flex mt-1 flex-col xs:gap-[14px] gap-2 rounded-lg"
          >
            {category === "anime" ? (
              <AnimeCard anime={item} />
            ) : (
              <MovieCard movie={item} category={category} />
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
  </div>
);

export default MoviesSlides;
