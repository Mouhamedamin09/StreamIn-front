export interface ITheme {
  title: string;
  icon: IconType;
}

export interface INavLink extends ITheme {
  path: string;
}

export interface IMovie {
  id: string;
  poster_path: string;
  original_title: string;
  name: string;
  overview: string;
  backdrop_path: string;
}

export interface IAnime {
  id: string;
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    large: string;
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
