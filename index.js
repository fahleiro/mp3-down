const express = require('express');
const app = express();
const port = 3000;
const ytdl = require('ytdl-core');
const fs = require('fs');
const removeAccents = require('remove-accents');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <h1>YouTube Audio Downloader</h1>
    <form action="/download" method="post">
      <label for="url">URL do vídeo do YouTube:</label><br>
      <input type="text" id="url" name="url" required><br>
      <button type="submit">Baixar Áudio</button>
    </form>
  `);
});

app.post('/download', async (req, res) => {
  const url = req.body.url;
  try {
    const info = await ytdl.getInfo(url);
    let title = info.videoDetails.title;
    title = removeAccents(title); // Remove acentos gráficos
    title = title.replace(/[^\w\s]/gi, ''); // Remove caracteres especiais do título
    const filePath = `C:/Users/gabriel.faleiro/Music/${title}.mp3`; // Caminho absoluto para o diretório de destino
    ytdl(url, { filter: 'audioonly' }).pipe(fs.createWriteStream(filePath));
    res.send('Download concluído');
  } catch (error) {
    console.error('Erro ao baixar áudio:', error);
    res.status(500).send('Erro ao baixar áudio');
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
