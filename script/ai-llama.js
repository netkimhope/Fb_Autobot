const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "llama",
  version: "1.0.0",
  aliases: ["llm", "lama", "🦙"],
  role: 0,
  credits: "Kenneth Panio",
  info: "Get a llama response.",
  type: "artificial-intelligence",
  usage: "[prompt]",
  cd: 5,
};

module.exports.run = async function ({ api, event, args, Currencies }) {
  const { threadID, senderID, messageID } = event;
  const price = 500;
  const userMoney = (await Currencies.getData(senderID)).money;
  const prompt = args.join(" ");

  if (!prompt) {
    return api.sendMessage(`Please provide a prompt for the llama. cost $${price.toLocaleString()}`, threadID, messageID);
  } else {
    api.setMessageReaction("🕣", messageID, () => { }, true);
    api.sendMessage("🕣 | 𝘈𝘯𝘴𝘸𝘦𝘳𝘪𝘯𝘨....", threadID, messageID);
  }

  try {
    const response = await axios.get(`https://mixtral.aliestercrowley.com/api?username=${senderID}&prompt=${encodeURIComponent(prompt)}`);
    const llamaResponse = response.data.response;

    api.sendMessage({ body: llamaResponse }, threadID, messageID);

    if (userMoney >= price) {
      await Currencies.decreaseMoney(senderID, price);
      const newBalance = (userMoney - price).toLocaleString();

      const beastUrl = 'https://www.api.vyturex.com/beast';
      try {
        const beastResponse = await axios.get(`${beastUrl}?query=${encodeURIComponent(llamaResponse)}`);
        if (beastResponse.data && beastResponse.data.audio) {
          const audioURL = beastResponse.data.audio;
          const fileName = "mrbeast_voice.mp3";
          const filePath = path.resolve(__dirname, 'cache', fileName);

          const { data: audioData } = await axios.get(audioURL, { responseType: 'arraybuffer' });
          fs.writeFileSync(filePath, audioData);

          api.sendMessage({
            body: '💽𝗩𝗼𝗶𝗰𝗲 𝗕𝗼𝘅' + `\n\n-$${price.toLocaleString()}`,
            attachment: fs.createReadStream(filePath),
          }, threadID, async (voiceError) => {
            if (voiceError) {
              console.error('Error sending voice response:', voiceError);
            }

          if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath)
            }
          });
        } else {
          console.error("Failed to fetch Beast API response.");
        }
      } catch (beastError) {
        console.error('Error during Beast API request:', beastError);
      }
    } else {
      api.sendMessage(`💰 | Insufficient funds. This command costs $${price.toLocaleString()}. Earn more money to use this command!`, threadID, messageID);
    }
  } catch (error) {
    console.error('Error during Llama API request:', error);
  }
};

async function getUserName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);
    return userInfo && userInfo[userID] ? userInfo[userID].name : "unknown";
  } catch (error) {
    console.error('Error getting user name:', error);
    return "unknown";
  }
}
