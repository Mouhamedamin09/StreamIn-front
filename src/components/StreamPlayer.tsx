import React, { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

export interface StreamPlayerProps {
  title: string;
  posterSrc: string;
  servers: Array<{
    name: string;
    sources: Array<{ quality: string; url: string }>;
  }>;
  subtitles?: Array<{ lang: string; url: string }>;
  onClose: () => void;
  onNextEpisode: () => void;
  onPreviousEpisode: () => void;
  hasNextEpisode: boolean;
  hasPreviousEpisode: boolean;
  episodeNumber: number;
}

const StreamPlayer: React.FC<StreamPlayerProps> = ({
  title,
  posterSrc,
  servers,
  subtitles = [],
  onClose,
  onNextEpisode,
  onPreviousEpisode,
  hasNextEpisode,
  hasPreviousEpisode,
  episodeNumber,
}) => {
  const [serverIdx, setServerIdx] = useState(0);
  const [quality, setQuality] = useState(
    servers[0]?.sources[0]?.quality || "default"
  );
  const currentServer = servers[serverIdx];
  const currentSource =
    currentServer.sources.find((s) => s.quality === quality) ||
    currentServer.sources[0];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!currentSource || !videoRef.current) return;
    if (currentSource.url.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(currentSource.url);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          videoRef.current?.play();
        });
        return () => {
          hls.destroy();
        };
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = currentSource.url;
        videoRef.current.addEventListener("loadedmetadata", function () {
          videoRef.current?.play();
        });
      }
    } else {
      videoRef.current.src = currentSource.url;
    }
  }, [currentSource]);

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
            {servers.map((server, idx) => (
              <button
                key={server.name}
                onClick={() => {
                  setServerIdx(idx);
                  setQuality(server.sources[0]?.quality || "default");
                }}
                className={`px-3 py-2 rounded border font-bold ${
                  serverIdx === idx
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                {server.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            {currentServer.sources.map((source) => (
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
          <video
            ref={videoRef}
            poster={posterSrc}
            controls
            className="w-full h-full rounded-lg bg-black"
            autoPlay
          >
            {subtitles.map((subtitle) => (
              <track
                key={subtitle.lang}
                kind="subtitles"
                src={subtitle.url}
                label={subtitle.lang}
                srcLang={subtitle.lang}
              />
            ))}
          </video>
        </div>
      </div>
    </div>
  );
};

export default StreamPlayer;
