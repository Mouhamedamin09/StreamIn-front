import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader, Error } from "@/common";

const ActorDetails = () => {
  const { id } = useParams();
  const [actor, setActor] = useState<any>(null);
  const [knownFor, setKnownFor] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActor() {
      setIsLoading(true);
      setError(null);
      try {
        const resActor = await fetch(
          `https://proxy-api-server-woz1.onrender.com/v1/tmdb/3/person/${id}?api_key=374ed57246cdd0d51e7f9c7eb9e682f0`
        );
        const actorData = await resActor.json();
        setActor(actorData);
        const resCredits = await fetch(
          `https://proxy-api-server-woz1.onrender.com/v1/tmdb/3/person/${id}/combined_credits?api_key=374ed57246cdd0d51e7f9c7eb9e682f0`
        );
        const creditsData = await resCredits.json();
        const filteredCredits = (creditsData.cast || [])
          .filter(
            (credit: any) =>
              credit.media_type !== "tv" ||
              (credit.genre_ids && credit.genre_ids.indexOf(10767) === -1)
          )
          .sort((a: any, b: any) => b.popularity - a.popularity)
          .slice(0, 30);
        setKnownFor(filteredCredits);
      } catch (err) {
        setError("Failed to load actor details.");
      }
      setIsLoading(false);
    }
    fetchActor();
  }, [id]);

  if (isLoading) return <Loader />;
  if (error || !actor) return <Error error={error || "Actor not found."} />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl mt-40">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <img
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
              : "/default-anime.png"
          }
          alt={actor.name}
          className="rounded-lg w-[220px] h-[300px] object-cover shadow-lg border-4 border-gray-700 mb-4 md:mb-0"
        />
        <div className="flex-1">
          <h2 className="text-4xl font-extrabold mb-2 text-white tracking-tight drop-shadow-lg">
            {actor.name}
          </h2>
          <div className="flex flex-wrap gap-4 mb-4 text-gray-300">
            <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
              Born: {actor.birthday || "Unknown"}
            </span>
            <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
              Place: {actor.place_of_birth || "Unknown"}
            </span>
          </div>
          <p className="mb-4 text-gray-200 leading-relaxed text-lg whitespace-pre-line">
            {actor.biography || "No biography available."}
          </p>
        </div>
      </div>
      <h3 className="text-2xl font-bold mt-10 mb-4 text-red-400">Known For</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {knownFor.map((movie) => (
          <a
            key={movie.id}
            href={`/${movie.media_type}/${movie.id}`}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200 block"
            style={{ textDecoration: "none" }}
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "/default-anime.png"
              }
              alt={movie.title || movie.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-3">
              <h4 className="text-base font-bold text-gray-100 mb-1 truncate">
                {movie.title || movie.name}
              </h4>
              <p className="text-xs text-gray-400">
                {movie.release_date || movie.first_air_date || ""}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ActorDetails;
