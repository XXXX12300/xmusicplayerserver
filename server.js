// server.js
const express = require('express');
const ytdlp = require('yt-dlp-exec');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/audio/:id', async (req, res) => {
  const videoId = req.params.id;
  if (!videoId) return res.status(400).send('Missing video ID');

  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot']
    });

    const audio = info.formats.find(f => f.asr && f.ext === 'm4a');

    if (!audio) return res.status(404).send('No audio stream found');

    res.redirect(audio.url); // envía el stream directo
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to extract audio');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎧 Server running on port ${PORT}`);
});
