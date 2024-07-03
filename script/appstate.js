const axios = require('axios');

module.exports.config = {
  name: "cookie",
  version: "1.0",
  role: 0,
  info: "get your appstate without extension",
  credits: "Mark Hitsuraan",
  aliases: ["fbstate","appstate"], 
  cd: 3
};

module.exports.run = async function ({ api, event, args, chat }) {

  if (args.length !== 2) {
    return chat.reply("Please provide email and password.\n\nexample: appstate [email] [password]", event.threadID, event.messageID);
  }

  //const { messageID } = event;

  const [email, password] = args.map(arg => arg.trim());

  //const marky = await chat.reply("Please bear with me while I ponder your request...");
  api.setMessageReaction("⏳", event.messageID, () => {}, true);
      const marky = await chat.reply("⏳ | Getting your appstate, please wait...");

  try {
    const mark = await axios.get(`https://fca-state-742186ef5cca.herokuapp.com/appstate?e=${email}&p=${password}`);
    const userData = mark.data;

    api.setMessageReaction("✅", event.messageID, () => {}, true);
     chat.edit(JSON.stringify(userData, null, 4), marky.messageID);
  } catch (error) {
    console.error("error", error);
    chat.reply("error bai, change password ka muna tapos subukan mo ulit.", event.threadID, event.messageID);
  }
}
