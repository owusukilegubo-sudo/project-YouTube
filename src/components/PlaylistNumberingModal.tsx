import React, { useState } from 'react';
import { ListMusic, Hash, Check, X } from 'lucide-react';

interface PlaylistNumberingModalProps {
  isOpen: boolean;
  playlistTitle: string;
  itemCount: number;
  onConfirm: (options: { numberSequentially: boolean }) => void;
  onClose: () => void;
}

export const PlaylistNumberingModal: React.FC<PlaylistNumberingModalProps> = ({
  isOpen,
  playlistTitle,
  itemCount,
  onConfirm,
  onClose,
}) => {
  const [numberSequentially, setNumberSequentially] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="fluent-card rounded-2xl border border-zinc-700/80 w-full max-w-md p-6 space-y-5 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-bold text-blue-400">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <ListMusic className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-zinc-100">Playlist Download Options</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-200 line-clamp-1">{playlistTitle}</h3>
          <p className="text-xs text-zinc-400 mt-0.5">{itemCount} items selected for batch download</p>
        </div>

        <div className="space-y-3 pt-1">
          <div
            onClick={() => setNumberSequentially(!numberSequentially)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              numberSequentially
                ? 'bg-blue-600/10 border-blue-500/40 text-zinc-100'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Hash className={`w-4 h-4 ${numberSequentially ? 'text-blue-400' : 'text-zinc-500'}`} />
              <div>
                <p className="text-xs font-semibold">Prefix Video Titles with Numbers</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Example: <code className="text-blue-400 font-mono">01 - Video Title.mp4</code>
                </p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                numberSequentially ? 'bg-blue-600 border-blue-500 text-white' : 'border-zinc-700'
              }`}
            >
              {numberSequentially && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700/60"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm({ numberSequentially });
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            Start Download
          </button>
        </div>
      </div>
    </div>
  );
};
