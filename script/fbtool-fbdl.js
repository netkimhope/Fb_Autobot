const axios = require('axios');
const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

module.exports.config = {
  name: 'fbdl',
  aliases: ['fbdown', 'fbdownloader'],
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  info: 'Download and send a Facebook video',
  type: 'downloader',
  usage: '[video URL]',
  cd: 3,
};

module.exports.run = async function({ api, event, args }) {
  if (args.length === 0) {
    await api.sendMessage('Please provide a valid Facebook video URL.', event.threadID);
    return;
  }

  const videoURL = args[0];

  try {
    const response = await axios.get(`https://scp-09.onrender.com/api/fbdl?url=${encodeURIComponent(videoURL)}`);
    const data = response.data;

    if (data.success) {
      // Create 'cache' directory if it doesn't exist
      const cacheDir = './cache';
      if (!fs.existsSync(cacheDir)) {
        await mkdirAsync(cacheDir);
      }

      await api.sendMessage('Facebook video is downloaded. Please wait while it\'s being sent...', event.threadID);

      const highQualityLink = data.links['Download High Quality'];

      const videoBuffer = await axios.get(highQualityLink, { responseType: 'arraybuffer' });
      const videoFileName = `${cacheDir}/${Date.now()}.mp4`;

      await fs.promises.writeFile(videoFileName, videoBuffer.data);
      const videoStream = fs.createReadStream(videoFileName);

      await api.sendMessage({ attachment: videoStream }, event.threadID);
      await unlinkAsync(videoFileName);

    } else {
      await api.sendMessage('Failed to retrieve the video.', event.threadID);
    }
  } catch (error) {
    console.error(error);
    await api.sendMessage('An error occurred while processing your request.', event.threadID);
  }
};
