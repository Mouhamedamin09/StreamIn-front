import { useEffect, useState, useCallback, useRef } from "react";
import { m } from "framer-motion";
import { useParams } from "react-router-dom";
import { FaPlay, FaChevronDown } from "react-icons/fa";

import { Poster, Loader, Error, Section } from "@/common";
import { Casts, Videos, Genre } from "./components";

import { useGetShowQuery } from "@/services/TMDB";
import { useMotion } from "@/hooks/useMotion";
import { mainHeading, maxWidth, paragraph } from "@/styles";
import { cn } from "@/utils/helper";
import analytics from "@/utils/analytics";

// API functions for streaming
const API_KEY = "374ed57246cdd0d51e7f9c7eb9e682f0";
const BASE_URL = "/tmdb";

const tmdbApi = {
  get: (url: string) =>
    fetch(`${BASE_URL}${url}?api_key=${API_KEY}`).then((res) => res.json()),
};

const Detail = () => {
  const { category, id } = useParams();
  const [show, setShow] = useState<Boolean>(false);
  const [watchOption, setWatchOption] = useState("server3");
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [logoUrl, setLogoUrl] = useState("");
  const watchSectionRef = useRef<HTMLDivElement>(null);

  const { fadeDown, staggerContainer } = useMotion();

  const {
    data: movie,
    isLoading,
    isFetching,
    isError,
  } = useGetShowQuery({
    category: String(category),
    id: Number(id),
  });

  useEffect(() => {
    document.title =
      (movie?.title || movie?.name) && !isLoading
        ? movie.title || movie.name
        : "StreamIn";

    // Track page view when movie data loads
    if (movie && !isLoading) {
      analytics.trackPageView(`${category}/${id}`, {
        movieId: id,
        movieTitle: movie.title || movie.name,
        category: category,
      });
    }

    return () => {
      document.title = "StreamIn";
    };
  }, [movie?.title, isLoading, movie?.name, category, id]);

  useEffect(() => {
    if (movie && category === "tv") {
      setSeasons(movie.seasons || []);
    }
  }, [movie, category]);

  useEffect(() => {
    const fetchExternalIds = async () => {
      try {
        const response = await tmdbApi.get(`/${category}/${id}/external_ids`);
        if (response.imdb_id) {
          setLogoUrl(
            `https://live.metahub.space/logo/medium/${response.imdb_id}/img`
          );
        }
      } catch (error) {
        console.error("Error fetching external IDs:", error);
      }
    };

    if (movie) {
      fetchExternalIds();
    }
  }, [movie, category, id]);

  // Fetch episodes when season changes
  useEffect(() => {
    const fetchEpisodes = async () => {
      if (category === "tv" && selectedSeason) {
        try {
          const response = await tmdbApi.get(
            `/tv/${id}/season/${selectedSeason}`
          );
          setEpisodes(response.episodes || []);
          setSelectedEpisode(1);
        } catch (error) {
          console.error("Error fetching episodes:", error);
        }
      }
    };

    fetchEpisodes();
  }, [category, id, selectedSeason]);

  const toggleShow = () => setShow((prev) => !prev);

  const scrollToWatch = () => {
    watchSectionRef.current?.scrollIntoView({ behavior: "smooth" });

    // Track watch button click
    analytics.trackContentClick(
      id || "",
      movie?.title || movie?.name || "",
      category || "",
      "watch_button_click"
    );
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError) {
    return <Error error="Something went wrong!" />;
  }

  const {
    title,
    poster_path: posterPath,
    overview,
    name,
    genres,
    videos,
    credits,
  } = movie;

  const backgroundStyle = {
    backgroundImage: `linear-gradient(to top, rgba(0,0,0), rgba(0,0,0,0.98),rgba(0,0,0,0.8) ,rgba(0,0,0,0.4)),url('https://image.tmdb.org/t/p/original/${posterPath}'`,
    backgroundPosition: "top",
    backgroundSize: "cover",
  };

  const isTv = category === "tv";

  return (
    <>
      <section className="w-full" style={backgroundStyle}>
        <div
          className={`${maxWidth} lg:py-36 sm:py-[136px] sm:pb-28 xs:py-28 xs:pb-12 pt-24 pb-8 flex flex-row lg:gap-12 md:gap-10 gap-8 justify-center`}
        >
          <Poster title={title} posterPath={posterPath} />
          <m.div
            variants={staggerContainer(0.2, 0.4)}
            initial="hidden"
            animate="show"
            className="text-gray-300 sm:max-w-[80vw] max-w-[90vw]  md:max-w-[520px] font-nunito flex flex-col lg:gap-5 sm:gap-4 xs:gap-[14px] gap-3 mb-8 flex-1 will-change-transform motion-reduce:transform-none"
          >
            <m.h2
              variants={fadeDown}
              className={cn(
                mainHeading,
                " md:max-w-[420px] will-change-transform motion-reduce:transform-none"
              )}
            >
              {title || name}
            </m.h2>

            <m.ul
              variants={fadeDown}
              className="flex flex-row items-center  sm:gap-[14px] xs:gap-3 gap-[6px] flex-wrap will-change-transform motion-reduce:transform-none"
            >
              {genres.map((genre: { name: string; id: number }) => {
                return <Genre key={genre.id} name={genre.name} />;
              })}
            </m.ul>

            <m.p
              variants={fadeDown}
              className={`${paragraph} will-change-transform motion-reduce:transform-none`}
            >
              <span>
                {overview.length > 280
                  ? `${show ? overview : `${overview.slice(0, 280)}...`}`
                  : overview}
              </span>
              <button
                type="button"
                className={cn(
                  `font-bold ml-1 hover:underline transition-all duration-300`,
                  overview.length > 280 ? "inline-block" : "hidden"
                )}
                onClick={toggleShow}
              >
                {!show ? "show more" : "show less"}
              </button>
            </m.p>

            {/* Single Watch Button */}
            <m.div variants={fadeDown} className="flex flex-col gap-3">
              <button
                type="button"
                className="px-4 md:px-6 py-2 md:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-base md:text-lg font-semibold w-fit"
                onClick={scrollToWatch}
              >
                <FaPlay className="text-sm md:text-base" /> Watch Now
                <FaChevronDown className="ml-2 text-sm md:text-base" />
              </button>
            </m.div>

            <Casts casts={credits?.cast || []} />
          </m.div>
        </div>
      </section>

      <Videos videos={videos.results} />

      {/* Watch Section */}
      <section ref={watchSectionRef} className={`${maxWidth} py-16`}>
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                  <FaPlay className="text-white text-sm" />
                </div>
                Watch {isTv ? "Episodes" : "Movie"}
              </h2>
              <p className="text-gray-400 text-sm">
                {isTv
                  ? "Select a season and episode to start watching"
                  : "Choose your preferred streaming server"}
              </p>
              <p className="text-green-400 text-xs mt-1">
                ✨ Default server (Vidsrc.cc) is ad-free and recommended
              </p>
            </div>

            {/* Server Selection - Top Right */}
            <div className="w-full lg:w-72">
              <div className="mb-3">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Streaming Server
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  💡 Top 3 servers are ad-free. Others may have ads.
                </p>
              </div>
              <select
                className="w-full bg-gray-800 text-white border-2 border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 hover:border-gray-500"
                value={watchOption}
                onChange={(e) => {
                  const newServer = e.target.value;
                  analytics.trackServerChange(id || "", watchOption, newServer);
                  setWatchOption(newServer);
                }}
              >
                <option value="server3">🎬 Vidsrc.cc - Ad-Free & Recommended</option>
                <option value="server4">📺 Vidsrc.dev - Ad-Free Alternative</option>
                <option value="server8">🌊 Vidsrc.nl - Clean Player</option>
                <option value="server6">🌟 Vidsrc.icu - Minimal Ads</option>
                <option value="server7">💫 Vidsrc.xyz - Good Quality</option>
                <option value="server1">🚀 VidLink - Backup Option</option>
                <option value="server2">⚡ Smashy Stream - Backup Option</option>
                <option value="server5">🔗 2embed - Backup Option</option>
                <option value="server9">🎭 Moviee.tv - Backup Option</option>
                <option value="server10">🔮 Embed.su - Backup Option</option>
                <option value="server11">⚙️ Autoembed - Backup Option</option>
                <option value="server12">🎪 Moviesapi - Backup Option</option>
                <option value="server13">🎯 123embed - Backup Option</option>
                <option value="server14">🚀 Flicky - Backup Option</option>
                <option value="server15">🎬 Rgshows - Backup Option</option>
              </select>
            </div>
          </div>

          {isTv ? (
            /* TV Show Layout */
            <div className="flex flex-col xl:flex-row gap-8">
              {/* Left Sidebar - Episode List */}
              <div className="xl:w-96 flex-shrink-0">
                {/* Season Selection */}
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-semibold mb-3">
                    📺 Select Season
                  </label>
                  <select
                    className="w-full bg-gray-800 text-white border-2 border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 hover:border-gray-500"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  >
                    {seasons
                      .filter((s: any) => s.season_number > 0)
                      .map((s: any) => (
                        <option key={s.id} value={s.season_number}>
                          Season {s.season_number} • {s.episode_count} Episodes
                        </option>
                      ))}
                  </select>
                </div>

                {/* Episode List */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">Episodes</h3>
                    <span className="text-gray-400 text-sm bg-gray-600 px-2 py-1 rounded-lg">
                      {episodes.length} episodes
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[300px] md:max-h-[500px] overflow-y-auto custom-scrollbar pr-4 mr-2 overflow-x-hidden">
                    {episodes.map((episode: any) => (
                      <button
                        key={episode.id}
                        onClick={() => {
                          analytics.trackEpisodeSelect(
                            id || "",
                            selectedSeason,
                            episode.episode_number
                          );
                          setSelectedEpisode(episode.episode_number);
                        }}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-200 border-2 ${
                          selectedEpisode === episode.episode_number
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500 shadow-lg shadow-red-500/25"
                            : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-gray-500 hover:shadow-md"
                        }`}
                        style={{ marginRight: "4px" }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-bold text-sm mb-1">
                              Episode {episode.episode_number}
                            </div>
                            <div className="text-sm opacity-90 line-clamp-2">
                              {episode.name}
                            </div>
                            {/* Removed episode air date display */}
                          </div>
                          {selectedEpisode === episode.episode_number && (
                            <div className="ml-3">
                              <FaPlay className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content - Episode Player */}
              <div className="flex-1">
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                  <div className="relative w-full aspect-video">
                    {watchOption === "server1" && (
                      <iframe
                        src={`https://vidlink.mda2233.workers.dev/tv/${id}/${selectedSeason}/${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                        onLoad={() => {
                          analytics.trackVideoStart(
                            id || "",
                            movie?.title || movie?.name || "",
                            category as "movie" | "tv" | "anime",
                            "server1",
                            { season: selectedSeason, episode: selectedEpisode }
                          );
                        }}
                      />
                    )}
                    {watchOption === "server2" && (
                      <iframe
                        src={`https://player.smashy.stream/tv/${id}?s=${selectedSeason}&e=${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                    {watchOption === "server3" && (
                      <iframe
                        src={`https://vidsrc.cc/v2/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                    {watchOption === "server4" && (
                      <iframe
                        src={`https://vidsrc.dev/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                    {watchOption === "server5" && (
                      <iframe
                        src={`https://www.2embed.cc/embedtv/${id}&s=${selectedSeason}&e=${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                    {watchOption === "server6" && (
                      <iframe
                        src={`https://vidsrc.icu/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                    {watchOption === "server7" && (
                      <iframe
                        src={`https://vidsrc.xyz/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                    {watchOption === "server8" && (
                      <iframe
                        src={`https://player.vidsrc.nl/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                    {watchOption === "server9" && (
                      <iframe
                        src={`https://moviee.tv/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                    {watchOption === "server10" && (
                      <iframe
                        src={`https://embed.su/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                    {watchOption === "server11" && (
                      <iframe
                        src={`https://autoembed.cc/embed/player.php?id=${id}&s=${selectedSeason}&e=${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                    {watchOption === "server12" && (
                      <iframe
                        src={`https://moviesapi.club/tv/${id}-${selectedSeason}-${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                    {watchOption === "server13" && (
                      <iframe
                        src={`https://play2.123embed.net/tv/${id}/${selectedSeason}/${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                    {watchOption === "server14" && (
                      <iframe
                        src={`https://flicky.host/embed/tv/?id=${id}/${selectedSeason}/${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                    {watchOption === "server15" && (
                      <iframe
                        src={`https://www.rgshows.me/player/series/api3/index.html?id=${id}&s=${selectedSeason}&e=${selectedEpisode}`}
                        allowFullScreen
                        className="w-full h-full"
                        title="StreamIn player"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Movie Layout - Just Player */
            <div className="bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
              <div className="relative w-full aspect-video">
                {watchOption === "server1" && (
                  <iframe
                    src={`https://vidlink.mda2233.workers.dev/movie/${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server2" && (
                  <iframe
                    src={`https://player.smashy.stream/movie/${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server3" && (
                  <iframe
                    src={`https://vidsrc.cc/v2/embed/movie/${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server4" && (
                  <iframe
                    src={`https://vidsrc.dev/embed/movie/${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server5" && (
                  <iframe
                    src={`https://www.2embed.cc/embed/${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server6" && (
                  <iframe
                    src={`https://vidsrc.icu/embed/movie/${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server7" && (
                  <iframe
                    src={`https://vidsrc.xyz/embed/movie/${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server8" && (
                  <iframe
                    src={`https://player.vidsrc.nl/embed/movie/${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server9" && (
                  <iframe
                    src={`https://moviee.tv/embed/movie/${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server10" && (
                  <iframe
                    src={`https://embed.su/embed/movie/${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server11" && (
                  <iframe
                    src={`https://autoembed.cc/embed/player.php?id=${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server12" && (
                  <iframe
                    src={`https://moviesapi.club/movie/${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server13" && (
                  <iframe
                    src={`https://play2.123embed.net/movie/${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server14" && (
                  <iframe
                    src={`https://flicky.host/embed/movie/?id=${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
                {watchOption === "server15" && (
                  <iframe
                    src={`https://www.rgshows.me/player/movies/api3/index.html?id=${id}`}
                    allowFullScreen
                    className="w-full h-full"
                    title="StreamIn player"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Section
        title={`Similar ${category === "movie" ? "movies" : "series"}`}
        category={String(category)}
        className={`${maxWidth}`}
        id={Number(id)}
        showSimilarShows
      />

      {/* Bottom spacing to prevent footer overlap */}
      <div className="pb-20"></div>
    </>
  );
};

export default Detail;
