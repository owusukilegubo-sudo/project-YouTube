import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { QuickBar } from './components/QuickBar';
import { DownloaderTab } from './components/DownloaderTab';
import { PlaylistTab } from './components/PlaylistTab';
import { LibraryTab } from './components/LibraryTab';
import { WebDownloadItem } from './components/DownloadCard';
import { Download, ListMusic, Folder } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'downloader' | 'playlist' | 'library'>('downloader');

  const isValidUrl = (url: string | null | undefined): boolean => {
    if (!url || url === 'null' || url === 'undefined' || url.trim() === '') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const rawStoredUrl = localStorage.getItem('yt_web_api_url');
  const storedUrl = isValidUrl(rawStoredUrl) ? rawStoredUrl : null;

  const candidateApiUrls = [
    storedUrl,
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:4000'
      : 'https://project-youtube.onrender.com',
    'http://localhost:4000',
    'https://project-youtube-api.onrender.com',
  ].filter((url): url is string => typeof url === 'string' && isValidUrl(url));

  const [apiServerUrl, setApiServerUrl] = useState<string>(candidateApiUrls[0] || 'http://localhost:4000');
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

  // Zero-Config Automatic Health & Endpoint Discovery
  const checkHealth = async () => {
    // Probe current endpoint first
    try {
      const res = await fetch(`${apiServerUrl}/api/health`);
      if (res.ok) {
        setIsApiOnline(true);
        return;
      }
    } catch {}

    // Auto-discover alternative working candidate endpoints silently
    for (const url of candidateApiUrls) {
      if (url === apiServerUrl) continue;
      try {
        const res = await fetch(`${url}/api/health`);
        if (res.ok) {
          setApiServerUrl(url);
          setIsApiOnline(true);
          localStorage.setItem('yt_web_api_url', url);
          return;
        }
      } catch {}
    }

    setIsApiOnline(false);
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

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex w-56 bg-[#16161a] border-r border-zinc-800 flex-col justify-between p-3 select-none flex-shrink-0">
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
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="flex md:hidden bg-[#16161a] border-t border-zinc-800 p-2 items-center justify-around select-none flex-shrink-0 z-50">
        <button
          onClick={() => setActiveTab('downloader')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all ${
            activeTab === 'downloader'
              ? 'text-blue-400 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Downloader</span>
        </button>

        <button
          onClick={() => setActiveTab('playlist')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all ${
            activeTab === 'playlist'
              ? 'text-blue-400 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          <span>Playlist</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all ${
            activeTab === 'library'
              ? 'text-blue-400 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>Library</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
