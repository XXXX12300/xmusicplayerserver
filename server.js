import express from 'express';
import { exec } from 'child_process';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const SONGS_DIR = path.join(__dirname, 'songs');
if (!fs.existsSync(SONGS_DIR)) fs.mkdirSync(SONGS_DIR);

app.post('/download', (req, res) => {
    const url = req.body.url;
    if (!url) return res.status(400).json({ error: 'No URL provided' });

    const command = `yt-dlp -x --audio-format mp3 -o "songs/%(title)s.%(ext)s" ${url}`;
    exec(command, (err, stdout, stderr) => {
        if (err) return res.status(500).json({ error: 'Download failed', details: stderr });

        const match = stdout.match(/songs\/(.+\.mp3)/);
        if (match) {
            const filename = match[1].trim();
            const downloadUrl = `/songs/${filename}`;
            return res.json({ downloadUrl });
        } else {
            return res.status(500).json({ error: 'MP3 not found in output' });
        }
    });
});

app.use('/songs', express.static('songs'));

app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});
