const axios = require("axios");
const request = require("request");
const fs = require("fs");
const path = require("path");


module.exports.config = {
  name: "shoti",
  version: "1.0.0",
  credits: "Mark Hitsuraan",
  description: "Tiktok girl edition",
  hasPermission: 0,
  commandCategory: "utility",
  usage: "[shoti]",
  cooldowns: 5,
  dependencies: [],
  usePrefix: true,
};

module.exports.run = async function ({ api, event}) {
  const { setMessageReaction: react } = api;
const { sendMessage: reply } = api;


  try {
    react("⏳", event.messageID, (err) => {}, true);

    const response = await axios.post(`https://markdevsapi-2014427ac33a.herokuapp.com/shoti`, { apikey: 'eugeneaguilar89' });

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