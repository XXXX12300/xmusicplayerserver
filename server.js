const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors());

app.get('/audio', (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing URL');

  res.setHeader('Content-Type', 'audio/mpeg');

  const ytdlp = spawn('yt-dlp', ['-f', 'bestaudio', '-o', '-', url]);

  ytdlp.stdout.pipe(res);

  ytdlp.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  ytdlp.on('close', code => {
    if (code !== 0) {
      console.error(`yt-dlp exited with code ${code}`);
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server running on port', port);
});
