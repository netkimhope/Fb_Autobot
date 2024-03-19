const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports.config = {
  name: "anime",
  version: "9.0.4",
  hasPermssion: 0,
  credits: "Eugene Aguilar",
  description: "waifu pic nsfw",
  commandCategory: "anime",
  usages: "anime <name>",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const name = args.join(" ");
    if (!name) {
      return api.sendMessage(`Please enter an anime name`, event.threadID, event.messageID);
    }

    const response = await axios.get(`https://api.waifu.pics/sfw/${name}`);
    const img = response.data.url;

    let filePath = path.join(__dirname, `cache/${event.senderID}.jpg`);

    const stream = await axios.get(img, { responseType: 'arraybuffer' });

    fs.writeFileSync(filePath, Buffer.from(stream.data, 'binary'));

    await api.sendMessage({ body: "Here's your anime pic", attachment: fs.createReadStream(filePath) }, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(`An error occurred:\n${error}`, event.threadID, event.messageID);
  }
};