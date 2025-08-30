import React, { useState } from "react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

export interface AnimePlayerProps {
  title: string;
  posterSrc: string;
  streamingData: any;
  onClose: () => void;
  onNextEpisode: () => void;
  onPreviousEpisode: () => void;
  hasNextEpisode: boolean;
  hasPreviousEpisode: boolean;
  episodeNumber: number;
}

const AnimePlayer: React.FC<AnimePlayerProps> = ({
  title,
  posterSrc,
  streamingData,
  onClose,
  onNextEpisode,
  onPreviousEpisode,
  hasNextEpisode,
  hasPreviousEpisode,
  episodeNumber,
}) => {
  const [quality, setQuality] = useState("default");
  const currentSource =
    streamingData.sources.find((s: any) => s.quality === quality) ||
    streamingData.sources[0];

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl flex flex-col">
        <div className="flex flex-wrap gap-3 mb-4 w-full justify-between items-center">
          <div className="flex gap-2 items-center">
            <button
              onClick={onPreviousEpisode}
              disabled={!hasPreviousEpisode}
              className="bg-red-500 text-white px-3 py-2 rounded flex items-center gap-2 disabled:opacity-50"
            >
              <FaChevronLeft /> Previous
            </button>
            <span className="text-white text-lg font-bold">
              Episode {episodeNumber}
            </span>
            <button
              onClick={onNextEpisode}
              disabled={!hasNextEpisode}
              className="bg-red-500 text-white px-3 py-2 rounded flex items-center gap-2 disabled:opacity-50"
            >
              Next <FaChevronRight />
            </button>
          </div>
          <div className="flex gap-2 items-center">
            {streamingData.sources.map((source: any) => (
              <button
                key={source.quality}
                onClick={() => setQuality(source.quality)}
                className={`px-3 py-2 rounded border font-bold ${
                  quality === source.quality
                    ? "bg-red-500 text-white"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                {source.quality}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="bg-gray-700 text-white px-3 py-2 rounded flex items-center gap-2"
          >
            <FaTimes /> Close
          </button>
        </div>
        <div className="w-full aspect-video relative">
          <MediaPlayer
            title={title}
            src={currentSource.url}
            poster={posterSrc}
            crossorigin
            className="w-full h-full"
          >
            <MediaProvider>
              {streamingData.subtitles?.map((subtitle: any) => (
                <track
                  key={subtitle.lang}
                  kind="subtitles"
                  src={subtitle.url}
                  label={subtitle.lang}
                  srcLang={subtitle.lang}
                />
              ))}
            </MediaProvider>
            <DefaultVideoLayout icons={defaultLayoutIcons} />
          </MediaPlayer>
        </div>
      </div>
    </div>
  );
};

export default AnimePlayer;
