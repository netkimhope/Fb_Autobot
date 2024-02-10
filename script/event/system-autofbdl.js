const axios = require('axios');
const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

module.exports.config = {
  name: 'auto-fbdl',
  version: '1.0.0',
  role: 0,
  info: 'Download and send a Facebook video',
  type: 'downloader',
  usage: '[video URL]',
  cd: 5,
};

module.exports.handleEvent = async ({ event, api }) => {
  const { threadID, body } = event;
  const pattern = /https:\/\/(?:www\.)?facebook\.com\/.*\/videos\/.*/;

  if (body && pattern.test(body)) {
    const videoURL = body.match(pattern)[0];

    try {
      const response = await axios.get(`https://scp-09.onrender.com/api/fbdl?url=${encodeURIComponent(videoURL)}`);
      const data = response.data;

      if (data.success) {
        const cacheDir = './cache';
        if (!fs.existsSync(cacheDir)) {
          await mkdirAsync(cacheDir);
        }

        await api.sendMessage('Facebook url detected downloading... Please wait while it\'s being sent...', threadID);

        const highQualityLink = data.links['Download High Quality'];

        const videoBuffer = await axios.get(highQualityLink, { responseType: 'arraybuffer' });
        const videoFileName = `${cacheDir}/${Date.now()}.mp4`;

        await fs.promises.writeFile(videoFileName, videoBuffer.data);
        const videoStream = fs.createReadStream(videoFileName);

        await api.sendMessage({ attachment: videoStream }, threadID);
        await unlinkAsync(videoFileName);

      } else {
        await api.sendMessage('Failed to retrieve the video.', threadID);
      }
    } catch (error) {
      console.error(error);
      await api.sendMessage('An error occurred while processing your request.', threadID);
    }
  }
};
