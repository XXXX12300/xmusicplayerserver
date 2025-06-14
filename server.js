const express = require("express");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/download", async (req, res) => {
  const videoURL = req.query.url;

  if (!videoURL || !ytdl.validateURL(videoURL)) {
    return res.status(400).send("URL de YouTube inválida");
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");

    res.header("Content-Disposition", `attachment; filename="${title}.mp3"`);

    const stream = ytdl(videoURL, { quality: "lowestaudio" });

    ffmpeg(stream)
      .audioBitrate(128)
      .format("mp3")
      .on("error", (err) => {
        console.error("Error en ffmpeg:", err.message);
        res.status(500).send("Error al convertir el audio");
      })
      .pipe(res, { end: true });
  } catch (error) {
    // Captura errores específicos de YouTube
    if (error.statusCode === 410) {
      return res.status(404).send("El video no está disponible (eliminado o bloqueado). el hueso");
    }

    console.error("Error al obtener información del video:", error);
    res.status(500).send("Error al procesar el video AAAAAAAAAAA Soy muy gay");
  }
});

app.get("/", (req, res) => {
  res.send(`
    <h1>YouTube Audio Downloader</h1>
    <form action="/download" method="GET">
      <input type="text" name="url" placeholder="Pega la URL de YouTube aquí" size="50"/>
      <button type="submit">Descargar Audio</button>
    </form>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
