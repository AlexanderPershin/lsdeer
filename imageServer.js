const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const imageThumbnail = require('image-thumbnail');

const expressApp = express();
const router = express.Router();

expressApp.use(cors());
const expressPort = 15032;

// This server is used to fetch images from os
// to bypass browser web security
// Thumbnails for images
router.get('/file/:fullpath', async function (req, res) {
  // .ico images not supported by sharp, but were included
  // they'll be sent unchanged, because of small size
  let filePath = path.win32.normalize(req.params.fullpath);
  let options = { width: 150, height: 100, percentage: 5 };
  try {
    const thumbnail = await imageThumbnail(filePath, options);
    res.send(thumbnail);
  } catch (err) {
    // console.error(err, filePath);
    // Send full image on error: may be performance demanding
    console.log('Failed filePath', filePath);
    res.sendFile(filePath);
  }
});

// Background image
router.get('/bg/:fullpath', async function (req, res) {
  // Send fullsize image
  let filePath = req.params.fullpath;

  res.sendFile(filePath);
});

expressApp.use('/', router);

http
  .createServer(expressApp)
  .listen(expressPort, () =>
    console.log(`Image server is up on port ${expressPort}`)
  );
