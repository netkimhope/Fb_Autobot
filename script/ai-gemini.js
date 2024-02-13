const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports.config = {
  name: "gemini",
  version: "1.0.0",
  role: 0,
  aliases: ['gemini-pro', 'geminiai']
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
    api.sendMessage("🕣 | Generating response with Gemini AI....", threadID, messageID);

    const geminiResponse = await gemini(query);

    if (geminiResponse) {
      const formattedGeminiResponse = `${geminiResponse}`;
      api.sendMessage(formattedGeminiResponse, threadID, async (error) => {
        if (error) {
          console.error('Error sending text response:', error);
        }

        // Use Beast API for voice synthesis
        const audioURL = await generateBeastVoice(formattedGeminiResponse);

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
      api.sendMessage("No response from Gemini AI.", threadID, messageID);
    }
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, threadID, messageID);
  }
};

const genAI = new GoogleGenerativeAI('AIzaSyD4raIt2XwktawQ5Vulz6t6AymutqG7MgI'); // Replace with your actual Google API key
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

const gemini = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini' });
    const result = await model.generateContent(prompt);
    const response = result.response.candidates[0].content.parts[0].text;
    return response || null;
  } catch (error) {
    throw new Error('An error occurred while generating text with Gemini AI.');
  }
};
