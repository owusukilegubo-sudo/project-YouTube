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
    <header className="h-11 sm:h-14 bg-[#18181b]/95 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-2.5 sm:px-6 select-none text-zinc-300 z-40 flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-600/30 flex items-center justify-center border border-blue-500/40 shadow-sm flex-shrink-0">
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-zinc-100 font-bold text-xs sm:text-sm tracking-tight truncate">
            YT Downloader
          </span>
          <span className="text-blue-400 text-[9px] px-1 py-0.2 rounded bg-blue-500/10 border border-blue-500/20 uppercase font-mono hidden sm:inline-block">
            WEB PRO
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Backend API Server Status Badge */}
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono border transition-all ${
            isApiOnline
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
          title={`API Endpoint: ${apiServerUrl}`}
        >
          <Server className="w-3 h-3 flex-shrink-0" />
          <span className="hidden sm:inline">{isApiOnline ? 'API Connected' : 'API Disconnected'}</span>
          <span className="inline sm:hidden">{isApiOnline ? 'Online' : 'Offline'}</span>
          {isApiOnline ? <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />}
        </button>

        {/* GitHub Repository Link Button */}
        <a
          href="https://github.com/owusukilegubo-sudo/project-YouTube"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] sm:text-xs font-semibold border border-zinc-700/60 transition-colors shadow-sm"
          title="View GitHub Repository"
        >
          <Github className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
};
