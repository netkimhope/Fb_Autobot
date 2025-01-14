const { get } = require('axios');

module.exports.config = {
  name: 'ai1',
  credits: "cliff",
  version: '1.0.0',
  role: 0,
  aliases: ["ai"],
  cooldown: 0,
  hasPrefix: true,
  usage: "",
};

module.exports.run = async function ({ api, event, args }) {
  api.setMessageReaction("⏳", event.messageID, (err) => {
  }, true);
api.sendTypingIndicator(event.threadID, true);
  const question = args.join(' ');
  function sendMessage(msg) {
    api.sendMessage(msg, event.threadID, event.messageID);
  }

  const url = "https://hercai.onrender.com/v3/hercai";

  if (!question) return sendMessage("Please provide a question.");

  try {
    const response = await get(`${url}?question=${encodeURIComponent(question)}`);
    sendMessage(response.data.reply);
  } catch (error) {
    sendMessage("An error occurred: " + error.message);
  }
};
