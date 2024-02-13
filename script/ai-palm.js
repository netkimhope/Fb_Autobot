const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { TextServiceClient } = require('@google-ai/generativelanguage').v1beta2;
const { GoogleAuth } = require('google-auth-library');

module.exports.config = {
  name: "palm",
  version: "1.0.0",
  role: 0,
  aliases: ['palm-ai', 'palmai', 'coconut']
};

module.exports.run = async function ({ api, event, args }) {
  let { messageID, threadID } = event;
  const query = args.join(" ");

  if (!query) {
    api.sendMessage("❔ | Please Provide Input...", threadID, messageID);
    return;
  }

  try {
    api.setMessageReaction("🕣", messageID, () => {}, true);
    api.sendMessage("🕣 | Generating response with Palm AI....", threadID, messageID);

    const palmResponse = await palm(query);

    if (palmResponse) {
      const formattedResponse = `${palmResponse}`;
      api.sendMessage(formattedResponse, threadID, async (error) => {
        if (error) {
          console.error('Error sending text response:', error);
        }

        // Use Beast API for voice synthesis
        const audioURL = await generateBeastVoice(formattedResponse);

        if (audioURL) {
          api.sendMessage({
            body: "💽 𝗩𝗼𝗶𝗰𝗲",
            attachment: fs.createReadStream(audioURL),
          }, threadID, async (voiceError) => {
            if (voiceError) {
              console.error('Error sending voice response:', voiceError);
            }
          });
        } else {
          api.sendMessage("Failed to generate voice response.", threadID, messageID);
        }
      });
    } else {
      api.sendMessage("No response from Palm AI.", threadID, messageID);
    }
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, threadID, messageID);
  }
};

const MODEL_NAME = 'models/text-bison-001';
const API_KEY = 'AIzaSyD4raIt2XwktawQ5Vulz6t6AymutqG7MgI'; // Replace with your actual Google API key

const beastUrl = 'https://www.api.vyturex.com/beast';

const generateBeastVoice = async (text) => {
  try {
    const beastResponse = await axios.get(`${beastUrl}?query=${encodeURIComponent(text)}`);

    if (beastResponse.data && beastResponse.data.audio) {
      return beastResponse.data.audio;
    } else {
      console.error("Failed to fetch Beast API response.");
      return null;
    }
  } catch (error) {
    console.error('Error during Beast API request:', error);
    return null;
  }
};

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const palm = async (prompt) => {
  try {
    const result = await client.generateText({
      model: MODEL_NAME,
      prompt: {
        text: prompt,
      },
    });

    const output = result[0]?.candidates[0]?.output;
    return output || null;
  } catch (error) {
    throw new Error('An error occurred while generating text with Palm AI.');
  }
};
