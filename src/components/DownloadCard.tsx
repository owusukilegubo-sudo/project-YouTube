import React from 'react';
import { Video, Music, Download, CheckCircle, AlertTriangle, X, ExternalLink } from 'lucide-react';

export interface WebDownloadItem {
  id: string;
  url: string;
  title: string;
  channel?: string;
  isAudio: boolean;
  format: string;
  quality: string;
  status: 'queued' | 'downloading' | 'completed' | 'error';
  progress: number;
  downloadUrl?: string;
  error?: string;
  createdAt: string;
}

interface DownloadCardProps {
  item: WebDownloadItem;
  onRemove: (id: string) => void;
}

export const DownloadCard: React.FC<DownloadCardProps> = ({ item, onRemove }) => {
  const isCompleted = item.status === 'completed';
  const isError = item.status === 'error';
  const isDownloading = item.status === 'downloading' || item.status === 'queued';

  return (
    <div className="fluent-card fluent-card-hover rounded-xl p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 select-none">
      <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1 min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-center flex-shrink-0 text-blue-400">
          {item.isAudio ? <Music className="w-4 h-4 sm:w-5 sm:h-5" /> : <Video className="w-4 h-4 sm:w-5 sm:h-5" />}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-[11px] sm:text-xs font-semibold text-zinc-100 truncate tracking-tight" title={item.title}>
            {item.title}
          </h4>
          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-[11px] text-zinc-400">
            <span className="truncate max-w-[110px] sm:max-w-[150px]">{item.channel || 'Online Source'}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
            <span className="font-mono text-blue-400 uppercase">{item.quality} • {item.format}</span>
          </div>

          {isError && (
            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-red-400 font-medium">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{item.error || 'Download failed'}</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full sm:w-48 md:w-56 flex flex-col gap-1">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
          <span className="text-zinc-400">
            {isCompleted ? (
              <span className="text-emerald-400 flex items-center gap-1 font-sans font-medium">
                <CheckCircle className="w-3 h-3" /> Ready
              </span>
            ) : isError ? (
              <span className="text-red-400">Failed</span>
            ) : (
              'Processing...'
            )}
          </span>
          <span className="text-zinc-200 font-bold">
            {isCompleted ? '100%' : `${Math.round(item.progress || 0)}%`}
          </span>
        </div>

        <div className="w-full h-1.5 sm:h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/50 relative">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isCompleted
                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                : isError
                ? 'bg-red-500'
                : 'bg-gradient-to-r from-blue-600 to-blue-400 animate-pulse'
            }`}
            style={{ width: `${isCompleted ? 100 : item.progress || 0}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
        {isCompleted && item.downloadUrl ? (
          <a
            href={item.downloadUrl}
            download
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] sm:text-xs font-semibold flex items-center gap-1 shadow-md active:scale-95 transition-all"
          >
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Save File
          </a>
        ) : isDownloading ? (
          <div className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 text-[10px] sm:text-xs font-mono animate-pulse">
            Processing...
          </div>
        ) : null}

        <button
          onClick={() => onRemove(item.id)}
          className="p-1 sm:p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60 transition-colors"
          title="Remove from list"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};
