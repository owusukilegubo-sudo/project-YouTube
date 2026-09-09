import React from 'react';
import { Download, Github, Server, CheckCircle2, AlertCircle } from 'lucide-react';

interface HeaderProps {
  apiServerUrl: string;
  isApiOnline: boolean;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiServerUrl,
  isApiOnline,
  onOpenSettings,
}) => {
  return (
    <header className="h-14 bg-[#18181b]/90 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-6 select-none text-zinc-300 z-40">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-blue-600/30 flex items-center justify-center border border-blue-500/40 shadow-sm">
          <Download className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <span className="text-zinc-100 font-bold text-sm tracking-wide flex items-center gap-2">
            YT Downloader <span className="text-blue-400 text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 uppercase font-mono">WEB PRO</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend API Server Status Badge */}
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition-all ${
            isApiOnline
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
          }`}
          title={`API Endpoint: ${apiServerUrl}`}
        >
          <Server className="w-3 h-3" />
          <span>{isApiOnline ? 'API Connected' : 'API Disconnected'}</span>
          {isApiOnline ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-amber-400" />}
        </button>

        {/* GitHub Repository Link Button */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700/60 transition-colors shadow-sm"
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub Repo</span>
        </a>
      </div>
    </header>
  );
};
