const axios = require("axios");

module.exports.config = {
  name: "sim",
  aliases: ["simcard", "simi-simi", "chat"],
  version: "1.0.0",
  role: 0,
  credits: "KENLIEPLAYS",
  info: "Talk to sim",
  type: "chat",
  usage: "[ask]",
  cd: 2,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const { threadID, messageID } = event;

    const input = args.join(' ');

    if (!input) {
      api.sendMessage('Please type a message!', threadID, messageID);
      return;
    }

    const sim = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=ph&message=${encodeURIComponent(input)}&filter=false`);
    const respond = sim.data.success || 'Yawa ka!';

    api.sendMessage(respond, threadID, messageID);
  } catch (error) {
    console.error("Error:", error);
  }
};
