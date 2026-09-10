import React, { useState } from 'react';
import { Settings as SettingsIcon, Server, RefreshCw, CheckCircle2, AlertCircle, Save } from 'lucide-react';

interface SettingsTabProps {
  apiServerUrl: string;
  setApiServerUrl: (val: string) => void;
  isApiOnline: boolean;
  onCheckHealth: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  apiServerUrl,
  setApiServerUrl,
  isApiOnline,
  onCheckHealth,
}) => {
  const [urlInput, setUrlInput] = useState(apiServerUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiServerUrl(urlInput.trim());
    localStorage.setItem('yt_web_api_url', urlInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    onCheckHealth();
  };

  return (
    <div className="flex-1 flex flex-col p-2.5 sm:p-6 space-y-3 sm:space-y-6 overflow-y-auto select-none">
      <div className="fluent-card rounded-xl sm:rounded-2xl p-3.5 sm:p-6">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-blue-400 mb-1">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Web Application Preferences</span>
        </div>
        <h2 className="text-sm sm:text-xl font-bold text-zinc-100 tracking-tight">
          API Backend Endpoint & Diagnostics
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
        {/* Downloader API Endpoint Form */}
        <div className="fluent-card rounded-xl sm:rounded-2xl p-3.5 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-200">
            <Server className="w-4 h-4 text-blue-400" />
            <span>Downloader API Endpoint</span>
          </div>

          <p className="text-xs text-zinc-400">
            Enter the URL of your deployed Express API server (e.g. Render, Railway, or Localhost).
          </p>

          <form onSubmit={handleSave} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://localhost:4000 or https://your-app.onrender.com"
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onCheckHealth}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700/60 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Test Connection</span>
              </button>

              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savedSuccess ? 'Saved!' : 'Save Endpoint'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Server Connection Status */}
        <div className="fluent-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-200">Server Health Diagnostic</h3>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 border ${
                isApiOnline
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}
            >
              {isApiOnline ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {isApiOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          <div className="bg-zinc-900/90 rounded-xl p-4 border border-zinc-800/80 space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b border-zinc-800 pb-1.5">
              <span className="text-zinc-500">Active Host:</span>
              <span className="text-zinc-200 truncate max-w-[220px]">{apiServerUrl}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-1.5">
              <span className="text-zinc-500">Engine:</span>
              <span className="text-blue-400">yt-dlp + FFmpeg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Deployment Target:</span>
              <span className="text-emerald-400">GitHub Pages</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
