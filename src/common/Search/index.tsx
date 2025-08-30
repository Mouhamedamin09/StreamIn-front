import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

import { cn } from "@/utils/helper";

const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-2xl mx-auto px-4 md:px-0"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
          <FaSearch className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies and TV shows..."
          className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl md:rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-sm md:text-base"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <FaSearch className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      </div>
    </form>
  );
};

export default Search;
