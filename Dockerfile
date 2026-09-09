# Dockerfile for YT Downloader Web API Server
FROM node:20-slim

# Install system dependencies (yt-dlp and ffmpeg)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --only=production

# Copy application source
COPY server/ ./server/

EXPOSE 4000
ENV PORT=4000
ENV YT_DLP_PATH=/usr/local/bin/yt-dlp

CMD ["node", "server/index.js"]
