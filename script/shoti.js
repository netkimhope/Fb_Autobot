const axios = require("axios");
const request = require("request");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "shoti",
  version: "1.0.0",
  credits: "Eugene Aguilar",
  description: "Generate random tiktok girl videos",
  hasPermission: 0,
  commandCategory: "other",
  usage: "[shoti]",
  cooldowns: 5,
  dependencies: [],
  usePrefix: true,
};

module.exports.run = async function ({ api, event }) {
  const { setMessageReaction: react, sendMessage: reply } = api;

  try {
    react("⏳", event.messageID, (err) => {}, true);

    const linkResponse = await axios.post(`https://shoti-link.replit.app/shoti/link`);
    const links = linkResponse.data;
    const randomIndex = Math.floor(Math.random() * links.length);
    const randomLink = links[randomIndex];

    const response = await axios.get(`https://eurix-api.replit.app/api/tiktokdl/tools?link=${randomLink}`);

    const file = fs.createWriteStream(__dirname + "/cache/shoti.mp4");
    const username = response.data.username;
    const nickname = response.data.nickname;

    const rqs = request(encodeURI(response.data.url));
    rqs.pipe(file);

    file.on("finish", async () => {
      react("🔥", event.messageID, (err) => {}, true);

      await reply(
        {
          body: `Username: @${username}\nNickname: ${nickname}`,
          attachment: fs.createReadStream(__dirname + "/cache/shoti.mp4"),
        },
        event.threadID,
        event.messageID
      );
    });
  } catch (error) {
    react("🔴", event.messageID, (err) => {}, true);
  }
};