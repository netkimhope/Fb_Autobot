const axios = require('axios');
const fs = require('fs-extra');
const { fbdl } = require('vihangayt-fbdl');

module.exports.config = {
  name: "auto-fbdl",
  type: "downloader",
  info: "detects facebook video link and download",
  version: "2.0.0",
  credits: "Kenneth Panio",
  usage: "[url]",
  cd: 2,
};

module.exports.handleEvent = async ({ event, api }) => {
  const { threadID, messageID, senderID } = event;
  const pattern = /https:\/\/www\.facebook\.com\/\S+/;

  const body = event.body ? event.body.toLowerCase() : '';

  if (body && pattern.test(body)) {
    try {
      api.sendMessage("FB URL Detected!\nDownloading Video....", threadID, messageID);

      const link = body.match(pattern)[0];
      const response = await fbdl(link);

      const videoBuffer = await axios.get(response.result.HD, { responseType: 'arraybuffer' });

      const path = __dirname + `/cache/fbdl.mp4`;
      fs.writeFileSync(path, Buffer.from(videoBuffer.data, 'binary'));

      api.sendMessage(
        {
          body: "Downloaded Success!",
          attachment: fs.createReadStream(path),
        },
        threadID,
        () => fs.unlinkSync(path),
        messageID
      );
    } catch (error) {
      console.error("Failed to Download video!", error.message);
      api.sendMessage("Failed to send video, the link might not be supported or the API is unavailable.", threadID, messageID);
    }
  }
};
