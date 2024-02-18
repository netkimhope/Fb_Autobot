const fs = require('fs');
const path = require('path');
const axios = require('axios');

const sysDir = path.join(__dirname, 'system');
const urlJsonPath = path.join(sysDir, 'url.json');
const cacheDir = path.join(__dirname, 'cache');

fs.mkdirSync(sysDir, { recursive: true });
fs.mkdirSync(cacheDir, { recursive: true });

let urls = [];

try {
  urls = require(urlJsonPath);
} catch (err) {
  console.error('Error loading URL JSON:', err.message);
}

function saveUrls() {
  fs.writeFileSync(urlJsonPath, JSON.stringify(urls, null, 2));
}

module.exports.config = {
  name: "cosplay",
  version: "1.0.0",
  role: 0,
  credits: "Kenneth Panio",
  info: "Generate random cosplay images",
  usage: "[count]",
  cd: 0,
  aliases: ["rcp", "animecosplay", "anime-cosplay"]
};

module.exports.run = async function ({ api, event, args }) {
  function sendMsg(msg) {
    api.sendMessage(msg, event.threadID, event.messageID);
  }

  if (args[0] === "add" && args[1]) {
    const newUrls = args.slice(1).filter(url => url.startsWith('http'));

    if (!newUrls.length) {
      return sendMsg('Invalid URL. Please provide a valid URL.');
    }

    urls.push(...newUrls);
    saveUrls();
    return sendMsg('URLs added successfully!');
  }

  const count = parseInt(args[0]) || 1;

  if (count < 1 || count > 5) {
    return sendMsg('Invalid count value. Please choose a count between 1 and 5.');
  }

  const sendImg = async (url) => {
    try {
      const resp = await axios.get(url, { responseType: 'stream' });
      api.sendMessage({ attachment: resp.data }, event.threadID);
    } catch (err) {
      console.error('Error fetching image:', err.message);
    }
  };

  const randUrls = Array.from({ length: count }, () => {
    const randIdx = Math.floor(Math.random() * urls.length);
    return urls[randIdx];
  });

  for (const url of randUrls) {
    await sendImg(url);
  }
};
