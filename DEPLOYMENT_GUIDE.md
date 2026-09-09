# YT Downloader Web Edition - Deployment & Setup Guide

> **Target Platform**: GitHub Pages (Web Frontend) + Render / Railway (Express API Server)  
> **Source Directory**: `C:\Users\ilegu\yt-downloader-web`  

---

## 🚀 Overview

**YT Downloader Web Edition** is designed for 1-click deployment from your GitHub account. It consists of two parts:

1. **Web Frontend (React + Vite + Tailwind CSS)**: Deployed to **GitHub Pages** for free.
2. **Downloader API Backend (Node.js + Express + `yt-dlp` + `FFmpeg`)**: Deployed to **Render.com** (or Railway / Docker) for free to stream video/audio downloads directly to your web browser.

---

## 📁 Step 1: Create a GitHub Repository & Push Code

Open your terminal or PowerShell inside `C:\Users\ilegu\yt-downloader-web`:

```bash
cd C:\Users\ilegu\yt-downloader-web
git init
git add .
git commit -m "Initial commit of YT Downloader Web Edition"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/yt-downloader-web.git
git push -u origin main
```

---

## 🌐 Step 2: Enable GitHub Pages

Once your repository is pushed to GitHub:

1. Go to your GitHub repository on `github.com`:  
   `https://github.com/YOUR_GITHUB_USERNAME/yt-downloader-web`
2. Click on **Settings** (top navigation bar of your repo).
3. On the left sidebar, click **Pages**.
4. Under **Build and deployment** ➔ **Source**, select **`GitHub Actions`**.
5. The included automated workflow (`.github/workflows/deploy.yml`) will automatically build and publish your site to:  
   `https://YOUR_GITHUB_USERNAME.github.io/yt-downloader-web/`

---

## ⚡ Step 3: Deploy Downloader Backend API Server (Free on Render.com)

To process video extraction and browser downloads, deploy the included `Dockerfile` to Render.com:

1. Sign up / Log in to [Render.com](https://render.com/).
2. Click **New +** ➔ Select **Web Service**.
3. Connect your GitHub repository (`yt-downloader-web`).
4. Select **Docker** as the environment (Render will automatically detect the `Dockerfile` with `yt-dlp` and `ffmpeg` pre-installed).
5. Click **Create Web Service**.
6. Render will build and launch your backend server and give you a free URL:  
   `https://yt-downloader-api.onrender.com`

---

## ⚙️ Step 4: Link API Endpoint in Web App

1. Open your live GitHub Pages URL: `https://YOUR_GITHUB_USERNAME.github.io/yt-downloader-web/`
2. Click **API Settings** in the left sidebar.
3. Enter your Render backend URL (`https://yt-downloader-api.onrender.com`).
4. Click **Save Endpoint** and **Test Connection**.
5. Your web app is now fully functional and ready to download videos and audio files directly in any web browser!

---

## 💻 Running Locally (Development Mode)

To run both the frontend and backend locally on your PC:

1. Start the API backend server:
   ```bash
   npm run server
   # Runs on http://localhost:4000
   ```
2. In a separate terminal window, start the React dev server:
   ```bash
   npm run dev
   # Opens http://localhost:5173
   ```
