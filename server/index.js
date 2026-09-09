import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Temp directory for file processing
const tempDownloadDir = path.join(os.tmpdir(), 'yt-downloader-web-temp');
if (!fs.existsSync(tempDownloadDir)) {
  fs.mkdirSync(tempDownloadDir, { recursive: true });
}

// Check system yt-dlp location
function getYtDlpBinary() {
  const customPath = process.env.YT_DLP_PATH;
  if (customPath && fs.existsSync(customPath)) return customPath;

  const pythonWinPath = 'C:\\Users\\ilegu\\AppData\\Local\\Python\\pythoncore-3.14-64\\Scripts\\yt-dlp.exe';
  if (fs.existsSync(pythonWinPath)) return pythonWinPath;

  return 'yt-dlp'; // fallback to PATH
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'YT Downloader Web API Server is running',
    engine: getYtDlpBinary(),
    timestamp: new Date().toISOString()
  });
});

// Fetch Metadata (Single Video or Playlist)
app.get('/api/info', (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  const binPath = getYtDlpBinary();
  const args = ['--dump-json', '--flat-playlist', '--no-warnings', targetUrl];

  console.log(`[API Info] Fetching metadata for ${targetUrl}`);
  const child = spawn(binPath, args);
  let stdoutData = '';
  let stderrData = '';

  child.stdout.on('data', (data) => {
    stdoutData += data.toString();
  });

  child.stderr.on('data', (data) => {
    stderrData += data.toString();
  });

  child.on('close', (code) => {
    if (code === 0) {
      try {
        const lines = stdoutData.trim().split('\n').filter(Boolean);
        if (lines.length === 1) {
          const info = JSON.parse(lines[0]);
          res.json({
            isPlaylist: false,
            title: info.title,
            channel: info.uploader || info.channel || 'Unknown',
            thumbnail: info.thumbnail || (info.thumbnails && info.thumbnails.length ? info.thumbnails[info.thumbnails.length - 1].url : ''),
            duration: info.duration || 0,
            url: info.webpage_url || targetUrl
          });
        } else {
          // Playlist
          const items = lines.map((l, index) => {
            try {
              const parsed = JSON.parse(l);
              return {
                id: parsed.id || index.toString(),
                title: parsed.title || `Track ${index + 1}`,
                channel: parsed.uploader || 'Unknown',
                duration: parsed.duration || 0,
                url: parsed.url || parsed.webpage_url || targetUrl
              };
            } catch {
              return null;
            }
          }).filter(Boolean);

          res.json({
            isPlaylist: true,
            title: `Playlist (${items.length} items)`,
            thumbnail: items.length > 0 && items[0].url ? '' : '',
            itemCount: items.length,
            items
          });
        }
      } catch (e) {
        res.status(500).json({ error: 'Failed parsing JSON metadata: ' + e.message });
      }
    } else {
      res.status(500).json({ error: stderrData || `yt-dlp exited with code ${code}` });
    }
  });
});

// Stream Direct Media Download to Web Browser
app.get('/api/download', (req, res) => {
  const { url: targetUrl, isAudio, format = 'mp4', quality = '1080p', subtitles = 'none' } = req.query;

  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  const binPath = getYtDlpBinary();
  const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 4);
  const tempFilePattern = path.join(tempDownloadDir, `${fileId}_%(title)s.%(ext)s`);

  const args = [
    '--newline',
    '--no-warnings',
    '-c',
    '--retries', '20',
    '--add-metadata', // Embed Title, Artist, Date, Album, Track Number into media file tags
    '--embed-thumbnail', // Embed video thumbnail as cover art
    '--embed-chapters', // Embed timeline chapter markers
    '--parse-metadata', '%(uploader)s:%(artist)s', // Map channel to Artist tag
    '--parse-metadata', '%(uploader)s:%(publisher)s', // Map channel to Publisher tag
    '--parse-metadata', '%(playlist_title)s:%(album)s', // Map playlist name to Album tag
    '--parse-metadata', '%(playlist_index)s:%(track_number)s', // Map track position (1, 2, 3...) to Track Number tag
    '-o', tempFilePattern,
  ];

  if (subtitles === 'en') {
    args.push('--write-sub', '--write-auto-sub', '--sub-lang', 'en', '--convert-subs', 'srt');
  } else if (subtitles === 'all') {
    args.push('--write-sub', '--write-auto-sub', '--convert-subs', 'srt');
  }

  if (isAudio === 'true' || isAudio === true) {
    args.push('-x', '--audio-format', format === 'wav' ? 'wav' : 'mp3');
    if (quality === '320k') args.push('--audio-quality', '0');
    else if (quality === '190k') args.push('--audio-quality', '2');
    else args.push('--audio-quality', '5');
  } else {
    if (quality === '4k') args.push('-f', 'bestvideo[height<=2160]+bestaudio/best');
    else if (quality === '720p') args.push('-f', 'bestvideo[height<=720]+bestaudio/best');
    else args.push('-f', 'bestvideo[height<=1080]+bestaudio/best');
    
    args.push('--merge-output-format', format === 'mkv' ? 'mkv' : 'mp4');
  }

  args.push(targetUrl);

  console.log(`[API Download] Spawning: ${binPath} ${args.join(' ')}`);
  const child = spawn(binPath, args);

  child.on('close', (code) => {
    if (code === 0) {
      // Find generated output file
      const files = fs.readdirSync(tempDownloadDir).filter(f => f.startsWith(fileId));
      if (files.length > 0) {
        const filePath = path.join(tempDownloadDir, files[0]);
        const fileName = files[0].replace(`${fileId}_`, '');

        res.download(filePath, fileName, (err) => {
          // Cleanup temp file after transfer completes
          try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          } catch (e) {}
        });
      } else {
        res.status(500).json({ error: 'Downloaded file not found in temp storage' });
      }
    } else {
      res.status(500).json({ error: `yt-dlp stream process failed with code ${code}` });
    }
  });
});

app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`YT Downloader Web API Server running on port ${PORT}`);
  console.log(`Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`================================================`);
});
