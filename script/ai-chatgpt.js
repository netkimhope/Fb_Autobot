const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");

let endpoints = {};

try {
  const endpointPath = path.resolve(__dirname, 'system', 'endpoint.json');
  endpoints = require(endpointPath);
} catch (readError) {
  console.error('Error reading endpoint.json:', readError);
}

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  aliases: ['gpt', 'openai', 'chatgpt', 'kenneth', 'hercai', 'chat']
};

module.exports.run = async function({ api, event, args }) {
  let { threadID, messageID } = event;
  const input = args.join(' ');

  if (!input) {
    api.sendMessage(`Please provide a question.`, threadID, messageID);
    return;
  }

  const hercaiEndpointName = 'hercai'; 
  const hercaiEndpointURL = endpoints[hercaiEndpointName];

  if (!hercaiEndpointURL) {
    api.sendMessage(`Endpoint "${hercaiEndpointName}" not found in endpoint.json.`, threadID, messageID);
    return;
  }

  const audioEndpointName = 'audio';
  const audioEndpointURL = endpoints[audioEndpointName];

  if (!audioEndpointURL) {
    api.sendMessage(`Endpoint "${audioEndpointName}" not found in endpoint.json.`, threadID, messageID);
    return;
  }

  try {
    api.setMessageReaction("🕣", messageID, () => {}, true);
    api.sendMessage("🕣 | 𝘈𝘯𝘴𝘸𝘦𝘳𝘪𝘯𝘨....", threadID, messageID);

    const { data } = await axios.get(`${hercaiEndpointURL}${encodeURIComponent(input)}`);
    const response = data.reply;
    api.sendMessage(response, threadID, messageID);

    try {
      const audioResponse = await axios.get(`${audioEndpointURL}${encodeURIComponent(response)}`);
      if (audioResponse.data && audioResponse.data.audio) {
        const audioURL = audioResponse.data.audio;
        const fileName = "mrbeast_voice.mp3";
        const filePath = path.resolve(__dirname, 'cache', fileName);

        const { data: audioData } = await axios.get(audioURL, { responseType: 'arraybuffer' });
        fs.writeFileSync(filePath, audioData);

        api.sendMessage({
          body: "💽 𝗩𝗼𝗶𝗰𝗲",
          attachment: fs.createReadStream(filePath)
        }, threadID, async (voiceError) => {
          if (voiceError) {
            console.error('Error sending voice response:', voiceError);
          }

          fs.unlinkSync(filePath); 
        });
      } else {
        console.error("Failed to fetch audio API response.");
      }
    } catch (audioError) {
      console.error('Error during audio API request:', audioError);
    }
  } catch (error) {
    api.sendMessage(error.message, threadID, messageID);
  }
};
