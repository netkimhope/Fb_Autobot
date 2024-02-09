const axios = require('axios');
const fs = require('fs-extra');
const { fbdl2 } = require('vihangayt-fbdl');

module.exports.config = {
  name: "auto-fbdl",
  version: "2.0.0",
  role: 0,
  credits: "Kenneth Panio",
  info: "Download Facebook videos",
  hasPrefix: false,
  type: "downloader",
  usage: "[url]",
  cd: 5,
};

module.exports.handleEvent = async ({ event, api }) => {
  const { threadID, messageID, body } = event;
  const pattern = /https:\/\/www\.facebook\.com\/\S+/;

  if (body && pattern.test(body)) {
    try {
      api.sendMessage("FB URL Detected!\nDownloading Video....", threadID, messageID);

      const link = body.match(pattern)[0];
      const response = await fbdl2(link);

      if (response.status && response.result && response.result.HD) {
        const videoBuffer = await axios.get(response.result.HD, { responseType: 'arraybuffer' });

        const path = __dirname + `/cache/fbdl.mp4`;
        fs.writeFileSync(path, Buffer.from(videoBuffer.data, 'binary'));

        api.sendMessage(
          {
            body: `Downloaded Success! Title: ${response.result.Title}`,
            attachment: fs.createReadStream(path),
          },
          threadID,
          () => fs.unlinkSync(path),
          messageID
        );
      } else {
        throw new Error("Invalid response from fbdl");
      }
    } catch (error) {
      console.error("Failed to Download video!", error.message);
      api.sendMessage("Failed to send video, the link might not be supported or the API is unavailable.", threadID, messageID);
    }
  }
};
