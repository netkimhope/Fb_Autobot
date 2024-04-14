const axios = require("axios");
const fs = require('fs');

const balanceDataPath = process.cwd() + "/db/balance.json";

const deductionAmount = 150; 

module.exports.config = {
  name: "spotify",
  version: "69",
  hasPermission: 0,
  credits: "unknown", // kira
  description: "play song from spotify",
  usages: "Spotify <title>",
  usePrefix: false,
  commandCategory: "music",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args, message }) {
  const { threadID, messageID, senderID } = event; 
  const songName = args.join(" ");
  if (!songName) {
    return api.sendMessage("Please provide a song name. This command cost $150", threadID);
  }

  const loadingMessage = await api.sendMessage("downloading your song🕐..", threadID);

  try {
    
    let balanceData = JSON.parse(fs.readFileSync(balanceDataPath, 'utf8'));
    if (balanceData[senderID] < deductionAmount) {
      
      await api.sendMessage("Your balance is not enough, please use "daily" or play games to earn more coins., threadID);
      return;
    }
    balanceData[senderID] -= deductionAmount;
    fs.writeFileSync(balanceDataPath, JSON.stringify(balanceData));

    const spotifyResponse = await axios.get(`https://combined-api-a2153f3cf0b5.herokuapp.com/spotify?q=${encodeURIComponent(songName)}`);
    const trackURL = spotifyResponse.data.result;
    if (!trackURL) {
      throw new Error("No track found for the provided song name.");
    }

    const downloadResponse = await axios.get(trackURL, { responseType: 'stream' });
    const filePath = `${__dirname}/cache/${Date.now()}.mp3`;
    const writer = fs.createWriteStream(filePath);
    downloadResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log("File downloaded successfully:", filePath);

    await api.sendMessage({
      body: `🎧 Playing: ${songName}`,
      attachment: fs.createReadStream(filePath)
    }, threadID); 

    console.log("Audio sent successfully.");

  } catch (error) {
    console.error("Error occurred:", error);
    api.sendMessage(`An error occurred: ${error.message}`, threadID); 
  } finally {
    api.unsendMessage(loadingMessage.messageID); 
   }
};
