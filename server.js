const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // ✅ Permite que tu frontend acceda

app.get('/audio', (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl || !videoUrl.startsWith('http')) {
    return res.status(400).send('URL inválida');
  }

  res.setHeader('Content-Type', 'audio/mpeg');

  const ytdlp = spawn('yt-dlp', [
    '-f', 'bestaudio',
    '-o', '-',
    videoUrl
  ]);

  ytdlp.stdout.pipe(res);

  ytdlp.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ytdlp.on('close', (code) => {
    if (code !== 0) {
      console.error(`yt-dlp exited with code ${code}`);
    }
  });
});

app.get('/', (req, res) => {
  res.send('Servidor activo. Usa /audio?url=...');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
