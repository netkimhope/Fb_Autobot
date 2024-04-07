const axios = require("axios");

module.exports.config = {
  name: "teach",
  aliases: [],
  version: "1.0.0",
  role: 0,
  credits: "developer",
  info: "teach sim",
  type: "chat",
  usage: "teach hi => helo",
  cd: 0,
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const text = args.join(" ");
    const text1 = text.substr(0, text.indexOf(' => '));
    const text2 = text.split(" => ").pop();

    if (!text1 || !text2) {
      return api.sendMessage(`Usage: teach hi => hello`, event.threadID, event.messageID);
    }

    const response = await axios.get(`http://ger2-6.deploy.sbs:5099/teach?ask=${encodeURIComponent(text1)}&ans=${encodeURIComponent(text2)}`);
    api.sendMessage(`Your ask: ${text1}\nSim respond: ${text2}`, event.threadID, event.messageID);
  } catch (error) {
    console.error("An error occurred:", error);
    api.sendMessage("Oops! Something went wrong.", event.threadID, event.messageID);
  }
};