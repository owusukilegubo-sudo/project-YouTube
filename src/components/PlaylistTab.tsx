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
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto select-none">
      {/* Header & Analyzer */}
      <div className="fluent-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
            <ListMusic className="w-4 h-4" />
            <span>Batch Playlist Extractor</span>
          </div>

          {totalBatchCount > 0 && (
            <div className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold">
              Playlist Download Progress: {completedBatchCount} / {totalBatchCount}
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-zinc-100 tracking-tight mb-4">
          Download Entire YouTube Playlist or Channel
        </h2>

        <form onSubmit={handleParse} className="flex gap-2 max-w-3xl">
          <div className="relative flex-1">
            <input
              type="text"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="Paste Playlist or Channel URL (e.g. https://www.youtube.com/playlist?list=...)"
              className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!playlistUrl.trim() || isParsing}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            {isParsing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Parsing...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Parse Playlist</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Playlist Preview Banner & Items Checklist */}
      {playlistData && (
        <div className="fluent-card rounded-2xl p-6 flex-1 flex flex-col space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-zinc-800">
            <div className="w-32 h-20 rounded-xl bg-zinc-800 border border-zinc-700/60 overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-md">
              {playlistData.thumbnail ? (
                <img
                  src={playlistData.thumbnail}
                  alt={playlistData.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-zinc-500" />
              )}
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[9px] font-bold rounded bg-black/80 text-blue-400 font-mono">
                {playlistData.itemCount || playlistData.items?.length} VIDEOS
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-zinc-100 truncate">{playlistData.title}</h3>
              <p className="text-xs text-zinc-400 mt-1">
                {playlistData.channel || 'YouTube Playlist'} • {Object.values(selectedItems).filter(Boolean).length} of {playlistData.itemCount || playlistData.items?.length} items selected
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700/60"
              >
                Select / Deselect All
              </button>
              <button
                onClick={() => setIsNumberingModalOpen(true)}
                disabled={Object.values(selectedItems).filter(Boolean).length === 0}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Selected ({Object.values(selectedItems).filter(Boolean).length})</span>
              </button>
            </div>
          </div>

          {playlistData.items && (
            <div className="space-y-2 overflow-y-auto max-h-[360px] pr-2">
              {playlistData.items.map((item: any, idx: number) => {
                const isChecked = !!selectedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-blue-600/10 border-blue-500/30 text-zinc-100'
                        : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                      )}
                      <span className="text-xs font-mono text-zinc-500 flex-shrink-0">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="text-xs font-medium truncate">{item.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 flex-shrink-0 ml-2">
                      {item.channel}
                    </span>
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
