import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { QuickBar } from './components/QuickBar';
import { DownloaderTab } from './components/DownloaderTab';
import { PlaylistTab } from './components/PlaylistTab';
import { LibraryTab } from './components/LibraryTab';
import { SettingsTab } from './components/SettingsTab';
import { WebDownloadItem } from './components/DownloadCard';
import { Download, ListMusic, Folder, Settings as SettingsIcon } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'downloader' | 'playlist' | 'library' | 'settings'>('downloader');

  // Downloader API Host (default to localhost:4000 or custom)
  const [apiServerUrl, setApiServerUrl] = useState<string>(() => {
    return localStorage.getItem('yt_web_api_url') || 'http://localhost:4000';
  });
  const [isApiOnline, setIsApiOnline] = useState<boolean>(false);

  // QuickBar Preset States
  const [isAudio, setIsAudio] = useState(false);
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('1080p');
  const [subtitles, setSubtitles] = useState('none');

  // Input & Downloads state
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [downloads, setDownloads] = useState<WebDownloadItem[]>([]);
  const [library, setLibrary] = useState<WebDownloadItem[]>(() => {
    try {
      const saved = localStorage.getItem('yt_web_library');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [batchTotalCount, setBatchTotalCount] = useState(0);

  // Check API Server Health
  const checkHealth = async () => {
    try {
      const res = await fetch(`${apiServerUrl}/api/health`);
      if (res.ok) {
        setIsApiOnline(true);
      } else {
        setIsApiOnline(false);
      }
    } catch {
      setIsApiOnline(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, [apiServerUrl]);

  // Save library changes
  useEffect(() => {
    localStorage.setItem('yt_web_library', JSON.stringify(library));
  }, [library]);

  // Start Download Handler
  const handleStartDownload = async (
    targetUrl: string,
    customAudio?: boolean,
    batchOptions?: { numberSequentially?: boolean; itemIndex?: number }
  ) => {
    setIsAnalyzing(true);
    const downloadId = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    const useAudio = customAudio !== undefined ? customAudio : isAudio;
    const targetFormat = useAudio ? (format === 'mp4' ? 'mp3' : format) : format;

    let videoTitle = 'Online Media';
    let channelName = 'Web Download';

    try {
      // Try resolving metadata first
      const infoRes = await fetch(`${apiServerUrl}/api/info?url=${encodeURIComponent(targetUrl)}`);
      if (infoRes.ok) {
        const info = await infoRes.json();
        if (info.title) videoTitle = info.title;
        if (info.channel) channelName = info.channel;
      }
    } catch (e) {
      console.warn('Metadata resolution fallback:', e);
    }

    if (batchOptions?.numberSequentially && batchOptions.itemIndex !== undefined) {
      const prefix = String(batchOptions.itemIndex + 1).padStart(2, '0');
      videoTitle = `${prefix} - ${videoTitle}`;
    }

    // Direct Download URL from API
    const directDownloadUrl = `${apiServerUrl}/api/download?url=${encodeURIComponent(targetUrl)}&isAudio=${useAudio}&format=${targetFormat}&quality=${quality}&subtitles=${subtitles}`;

    const newCard: WebDownloadItem = {
      id: downloadId,
      url: targetUrl,
      title: videoTitle,
      channel: channelName,
      isAudio: useAudio,
      format: targetFormat,
      quality,
      status: 'completed', // Immediately available via streaming proxy
      progress: 100,
      downloadUrl: directDownloadUrl,
      createdAt: new Date().toISOString(),
    };

    setDownloads((prev) => [newCard, ...prev]);
    setLibrary((prev) => [newCard, ...prev]);
    setIsAnalyzing(false);
    setUrlInput('');
  };

  // Batch Playlist Handler
  const handleBatchDownload = (
    items: any[],
    options: { numberSequentially: boolean; playlistTitle: string }
  ) => {
    setBatchTotalCount(items.length);
    items.forEach((item, index) => {
      handleStartDownload(item.url || targetUrlFromItem(item), isAudio, {
        numberSequentially: options.numberSequentially,
        itemIndex: index,
      });
    });
    setActiveTab('downloader');
  };

  const targetUrlFromItem = (item: any) => {
    if (typeof item === 'string') return item;
    return item.url || item.webpage_url || '';
  };

  const handleRemoveDownload = (id: string) => {
    setDownloads((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRemoveLibraryItem = (id: string) => {
    setLibrary((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearLibrary = () => {
    setLibrary([]);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#121214] text-zinc-100 font-sans overflow-hidden">
      <Header
        apiServerUrl={apiServerUrl}
        isApiOnline={isApiOnline}
        onOpenSettings={() => setActiveTab('settings')}
      />

      <QuickBar
        isAudio={isAudio}
        setIsAudio={setIsAudio}
        format={format}
        setFormat={setFormat}
        quality={quality}
        setQuality={setQuality}
        subtitles={subtitles}
        setSubtitles={setSubtitles}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-56 bg-[#16161a] border-r border-zinc-800 flex flex-col justify-between p-3 select-none">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('downloader')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'downloader'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Downloader</span>
            </button>

            <button
              onClick={() => setActiveTab('playlist')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'playlist'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <ListMusic className="w-4 h-4" />
              <span>Playlist Extractor</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'library'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span>Web Library</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>API Settings</span>
            </button>
          </nav>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 text-[11px] text-zinc-400 font-mono">
            <p className="font-semibold text-zinc-300">Deployment Status</p>
            <p className="mt-1 text-emerald-400">GitHub Pages Ready</p>
          </div>
        </aside>

        {/* Main Content View */}
        <main className="flex-1 flex flex-col bg-[#121214] overflow-hidden">
          {activeTab === 'downloader' && (
            <DownloaderTab
              urlInput={urlInput}
              setUrlInput={setUrlInput}
              isAnalyzing={isAnalyzing}
              onStartDownload={(url) => handleStartDownload(url)}
              downloads={downloads}
              onRemoveDownload={handleRemoveDownload}
            />
          )}

          {activeTab === 'playlist' && (
            <PlaylistTab
              apiServerUrl={apiServerUrl}
              onBatchDownload={handleBatchDownload}
              completedBatchCount={downloads.filter((d) => d.status === 'completed').length}
              totalBatchCount={batchTotalCount}
            />
          )}

          {activeTab === 'library' && (
            <LibraryTab
              libraryItems={library}
              onClearLibrary={handleClearLibrary}
              onRemoveItem={handleRemoveLibraryItem}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              apiServerUrl={apiServerUrl}
              setApiServerUrl={setApiServerUrl}
              isApiOnline={isApiOnline}
              onCheckHealth={checkHealth}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
