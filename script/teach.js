const axios = require("axios");

module.exports.config = {
  name: "teach",
  aliases: ["teachsim", "teachchat"],
  version: "1.1.0",
  role: 0,
  credits: "KENLIEPLAYS",
  info: "Teach Sim a response",
  type: "chat",
  usage: "[ask] | [answer]",
  cd: 2,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const { threadID, messageID } = event;

    const [ask, answer] = args.join(' ').split('|').map(str => str.trim());

    if (!ask || !answer) {
      api.sendMessage('Please provide both a question and an answer separated by |', threadID, messageID);
      return;
    }

    const teachResponse = await axios.get(`https://mighty-taiga-33992-6547d84cd219.herokuapp.com/sim?q=${encodeURIComponent(ask)}&answer=${encodeURIComponent(answer)}`);
    const success = teachResponse.data.success;

    api.sendMessage(success, threadID, messageID);
  } catch (error) {
    console.error("Error:", error);
  }
};
