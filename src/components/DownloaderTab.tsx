import React, { useState } from 'react';
import { Link2, Clipboard, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { DownloadCard, WebDownloadItem } from './DownloadCard';

interface DownloaderTabProps {
  urlInput: string;
  setUrlInput: (val: string) => void;
  isAnalyzing: boolean;
  onStartDownload: (url: string) => void;
  downloads: WebDownloadItem[];
  onRemoveDownload: (id: string) => void;
}

export const DownloaderTab: React.FC<DownloaderTabProps> = ({
  urlInput,
  setUrlInput,
  isAnalyzing,
  onStartDownload,
  downloads,
  onRemoveDownload,
}) => {
  const [isQueueBoxClosed, setIsQueueBoxClosed] = useState(false);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
      }
    } catch (e) {
      console.warn('Clipboard access not allowed or unavailable:', e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim() && !isAnalyzing) {
      onStartDownload(urlInput.trim());
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
      {/* URL Input Hero Header */}
      <div className="fluent-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Instant Video & Audio Extractor</span>
          </div>

          <h2 className="text-xl font-bold text-zinc-100 tracking-tight mb-4">
            Paste Video or Playlist URL
          </h2>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Link2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="YouTube, TikTok, Instagram, Facebook"
                className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl pl-10 pr-24 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors border border-zinc-700/60"
              >
                <Clipboard className="w-3.5 h-3.5 text-blue-400" />
                <span>Paste</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!urlInput.trim() || isAnalyzing}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex-shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Download</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-[11px] text-zinc-400 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> YouTube 4K & 1080p
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 320kbps MP3 Audio
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> TikTok, Instagram & Facebook
            </span>
          </div>
        </div>
      </div>

      {/* Download Tasks Container (Closable Box) */}
      {!isQueueBoxClosed ? (
        <div className="flex-1 flex flex-col space-y-3 min-h-0 relative">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider text-xs">
              Download Tasks ({downloads.length})
            </h3>
            <button
              onClick={() => setIsQueueBoxClosed(true)}
              className="text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-colors"
              title="Close download tasks box"
            >
              Close Box ✕
            </button>
          </div>

          {downloads.length === 0 ? (
            <div className="fluent-card rounded-xl p-12 flex flex-col items-center justify-center text-center text-zinc-500 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center text-zinc-400">
                <Link2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-300">No active downloads</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Paste a video or playlist URL above to begin downloading directly in your browser.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 overflow-y-auto pr-1">
              {downloads.map((item) => (
                <DownloadCard
                  key={item.id}
                  item={item}
                  onRemove={onRemoveDownload}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            onClick={() => setIsQueueBoxClosed(false)}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700/60 transition-colors"
          >
            Show Download Tasks ({downloads.length})
          </button>
        </div>
      )}
    </div>
  );
};
