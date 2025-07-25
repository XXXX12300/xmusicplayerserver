FROM node:18

RUN apt-get update && \
    apt-get install -y ffmpeg yt-dlp

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3000
CMD ["node", "server.js"]
