import React from 'react';
import { Film, Music, ChevronDown } from 'lucide-react';

interface QuickBarProps {
  isAudio: boolean;
  setIsAudio: (val: boolean) => void;
  format: string;
  setFormat: (val: string) => void;
  quality: string;
  setQuality: (val: string) => void;
  subtitles: string;
  setSubtitles: (val: string) => void;
}

export const QuickBar: React.FC<QuickBarProps> = ({
  isAudio,
  setIsAudio,
  format,
  setFormat,
  quality,
  setQuality,
  subtitles,
  setSubtitles,
}) => {
  const videoFormats = ['mp4', 'mkv', 'webm'];
  const audioFormats = ['mp3', 'wav', 'm4a'];

  const videoQualities = [
    { id: '4k', label: '4K (2160p)' },
    { id: '1080p', label: '1080p Full HD' },
    { id: '720p', label: '720p HD' },
    { id: '480p', label: '480p SD' },
  ];

  const audioQualities = [
    { id: '320k', label: '320 kbps (High Quality)' },
    { id: '190k', label: '190 kbps (Medium Quality)' },
    { id: '128k', label: '128 kbps (Standard)' },
  ];

  const subtitleOptions = [
    { id: 'none', label: 'No Subtitles' },
    { id: 'en', label: 'English (.srt)' },
    { id: 'all', label: 'All Subtitles (.srt)' },
  ];

  const currentFormats = isAudio ? audioFormats : videoFormats;
  const currentQualities = isAudio ? audioQualities : videoQualities;

  return (
    <div className="bg-[#1a1a1e]/95 border-b border-zinc-800/80 px-2.5 sm:px-6 py-1.5 sm:py-2.5 flex items-center justify-between gap-2.5 text-[11px] sm:text-xs select-none overflow-x-auto no-scrollbar flex-shrink-0">
      {/* Mode Selector */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-zinc-400 font-medium hidden xs:inline">Mode:</span>
        <div className="flex bg-zinc-900/80 p-0.5 rounded-lg border border-zinc-800">
          <button
            onClick={() => {
              setIsAudio(false);
              setFormat('mp4');
              setQuality('1080p');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md font-medium transition-all ${
              !isAudio
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Film className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Video</span>
          </button>
          <button
            onClick={() => {
              setIsAudio(true);
              setFormat('mp3');
              setQuality('320k');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md font-medium transition-all ${
              isAudio
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Music className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Audio</span>
          </button>
        </div>
      </div>

      {/* Format, Quality, Subtitles Pickers */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-medium">Format:</span>
          <div className="relative">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-700/80 hover:border-zinc-600 rounded-lg px-3 py-1.5 pr-7 text-zinc-200 uppercase font-mono text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {currentFormats.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-medium">Quality:</span>
          <div className="relative">
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-700/80 hover:border-zinc-600 rounded-lg px-3 py-1.5 pr-7 text-zinc-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {currentQualities.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {!isAudio && (
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium">Captions:</span>
            <div className="relative">
              <select
                value={subtitles}
                onChange={(e) => setSubtitles(e.target.value)}
                className="appearance-none bg-zinc-900 border border-zinc-700/80 hover:border-zinc-600 rounded-lg px-3 py-1.5 pr-7 text-zinc-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {subtitleOptions.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
