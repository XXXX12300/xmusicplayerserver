const express = require('express');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/audio', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl || !videoUrl.startsWith('https://')) {
    return res.status(400).send('URL de YouTube no válida');
  }

  res.setHeader('Content-Type', 'audio/mpeg');

  const process = spawn('yt-dlp', [
    '-f', 'bestaudio',
    '-o', '-',
    '-q',
    videoUrl
  ]);

  process.stdout.pipe(res);

  process.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  process.on('close', code => {
    if (code !== 0) {
      console.error(`yt-dlp exited with code ${code}`);
    }
  });
});

app.get('/', (req, res) => {
  res.send(`<h1>Servidor activo</h1><p>Usa: /audio?url=https://www.youtube.com/watch?v=...</p>`);
});

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
