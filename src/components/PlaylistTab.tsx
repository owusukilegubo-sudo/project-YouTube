import React, { useState } from 'react';
import { ListMusic, CheckSquare, Square, Download, Search, Loader2, Image as ImageIcon } from 'lucide-react';
import { PlaylistNumberingModal } from './PlaylistNumberingModal';

interface PlaylistTabProps {
  apiServerUrl: string;
  onBatchDownload: (items: any[], options: { numberSequentially: boolean; playlistTitle: string }) => void;
  completedBatchCount?: number;
  totalBatchCount?: number;
}

export const PlaylistTab: React.FC<PlaylistTabProps> = ({
  apiServerUrl,
  onBatchDownload,
  completedBatchCount = 0,
  totalBatchCount = 0,
}) => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [playlistData, setPlaylistData] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [isNumberingModalOpen, setIsNumberingModalOpen] = useState(false);

  const handleParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl.trim()) return;

    setIsParsing(true);
    try {
      const res = await fetch(`${apiServerUrl}/api/info?url=${encodeURIComponent(playlistUrl.trim())}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setPlaylistData(data);
      if (data.isPlaylist && data.items) {
        const initialSelected: Record<string, boolean> = {};
        data.items.forEach((item: any) => {
          initialSelected[item.id] = true;
        });
        setSelectedItems(initialSelected);
      }
    } catch (err: any) {
      alert('Failed to parse playlist: ' + (err.message || err));
    } finally {
      setIsParsing(false);
    }
  };

  const toggleSelectAll = () => {
    if (!playlistData || !playlistData.items) return;
    const allSelected = Object.values(selectedItems).every(Boolean);
    const newSelected: Record<string, boolean> = {};
    playlistData.items.forEach((item: any) => {
      newSelected[item.id] = !allSelected;
    });
    setSelectedItems(newSelected);
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirmBatch = (options: { numberSequentially: boolean }) => {
    if (!playlistData || !playlistData.items) return;
    const itemsToDownload = playlistData.items.filter((item: any) => selectedItems[item.id]);
    onBatchDownload(itemsToDownload, {
      ...options,
      playlistTitle: playlistData.title || 'Playlist',
    });
  };

  return (
    <div className="flex-1 flex flex-col p-2.5 sm:p-6 space-y-3 sm:space-y-6 overflow-y-auto select-none">
      {/* Header & Analyzer */}
      <div className="fluent-card rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-blue-400">
            <ListMusic className="w-3.5 h-3.5" />
            <span>Batch Playlist Extractor</span>
          </div>

          {totalBatchCount > 0 && (
            <div className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] sm:text-xs font-mono font-bold">
              {completedBatchCount} / {totalBatchCount}
            </div>
          )}
        </div>

        <h2 className="text-sm sm:text-xl font-bold text-zinc-100 tracking-tight mb-2 sm:mb-4">
          Download Entire YouTube Playlist or Channel
        </h2>

        <form onSubmit={handleParse} className="flex flex-col sm:flex-row gap-2 max-w-3xl">
          <div className="relative flex-1">
            <input
              type="text"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="Paste Playlist URL..."
              className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!playlistUrl.trim() || isParsing}
            className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 flex-shrink-0"
          >
            {isParsing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Parsing...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Parse Playlist</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Playlist Preview Banner & Items Checklist */}
      {playlistData && (
        <div className="fluent-card rounded-xl sm:rounded-2xl p-3.5 sm:p-6 flex-1 flex flex-col space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-20 h-14 sm:w-32 sm:h-20 rounded-lg sm:rounded-xl bg-zinc-800 border border-zinc-700/60 overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-md">
                {playlistData.thumbnail ? (
                  <img
                    src={playlistData.thumbnail}
                    alt={playlistData.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-zinc-500" />
                )}
                <span className="absolute bottom-1 right-1 px-1 py-0.2 text-[8px] sm:text-[9px] font-bold rounded bg-black/80 text-blue-400 font-mono">
                  {playlistData.itemCount || playlistData.items?.length} VIDEOS
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-base font-bold text-zinc-100 truncate">{playlistData.title}</h3>
                <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">
                  {Object.values(selectedItems).filter(Boolean).length} of {playlistData.itemCount || playlistData.items?.length} selected
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-2">
              <button
                onClick={toggleSelectAll}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] sm:text-xs font-medium border border-zinc-700/60"
              >
                Toggle All
              </button>
              <button
                onClick={() => setIsNumberingModalOpen(true)}
                disabled={Object.values(selectedItems).filter(Boolean).length === 0}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-[10px] sm:text-xs flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Download ({Object.values(selectedItems).filter(Boolean).length})</span>
              </button>
            </div>
          </div>

          {playlistData.items && (
            <div className="space-y-1.5 sm:space-y-2 overflow-y-auto max-h-[220px] sm:max-h-[360px] pr-1">
              {playlistData.items.map((item: any, idx: number) => {
                const isChecked = !!selectedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-lg sm:rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-blue-600/10 border-blue-500/30 text-zinc-100'
                        : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                      )}
                      <span className="text-[10px] sm:text-xs font-mono text-zinc-500 flex-shrink-0">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="text-[11px] sm:text-xs font-medium truncate">{item.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <PlaylistNumberingModal
        isOpen={isNumberingModalOpen}
        playlistTitle={playlistData?.title || 'Playlist'}
        itemCount={Object.values(selectedItems).filter(Boolean).length}
        onConfirm={handleConfirmBatch}
        onClose={() => setIsNumberingModalOpen(false)}
      />
    </div>
  );
};
