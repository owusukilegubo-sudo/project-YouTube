import React from 'react';
import { Folder, Film, Music, Download, Trash2 } from 'lucide-react';
import { WebDownloadItem } from './DownloadCard';

interface LibraryTabProps {
  libraryItems: WebDownloadItem[];
  onClearLibrary: () => void;
  onRemoveItem: (id: string) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  libraryItems,
  onClearLibrary,
  onRemoveItem,
}) => {
  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto select-none">
      <div className="fluent-card rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Folder className="w-4 h-4" />
            <span>Browser Media Library</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            Downloaded Media History ({libraryItems.length})
          </h2>
        </div>

        {libraryItems.length > 0 && (
          <button
            onClick={onClearLibrary}
            className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {libraryItems.length === 0 ? (
        <div className="fluent-card rounded-2xl p-12 flex flex-col items-center justify-center text-center text-zinc-500 space-y-3 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center text-zinc-400">
            <Folder className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-300">Your Web Library is empty</p>
            <p className="text-xs text-zinc-500 mt-1">
              Completed video and audio downloads will automatically be saved here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {libraryItems.map((item) => (
            <div
              key={item.id}
              className="fluent-card fluent-card-hover rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center flex-shrink-0 text-blue-400">
                  {item.isAudio ? <Music className="w-5 h-5" /> : <Film className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-zinc-100 truncate">{item.title}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                    {item.quality} • {item.format.toUpperCase()} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.downloadUrl && (
                  <a
                    href={item.downloadUrl}
                    download
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60 transition-colors"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
