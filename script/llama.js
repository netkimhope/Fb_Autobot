const axios = require("axios");

module.exports.config = {
  name: "llama",
  version: "3.8",
  permission: 0,
  credits: "Mark Hitsuraan",
  description: "Powered by Llama AI",
  usePrefix: false,
  commandCategory: "No prefix",
  usages: "Llama AI",
  cooldown: 3,
};

async function convertVoiceToText(audioUrl, api, event) {
  try {
    api.sendMessage("🔊 Converting your audio, please wait...", event.threadID);

    const response = await axios.get(`https://markdevs-api.onrender.com/api/box?query=${encodeURIComponent(audioUrl)}`);
    const text = response.data.transcription;

    if (text) {
      api.sendMessage(`Voice context\n\n ${text}`, event.threadID, event.messageID);
    } else {
      api.sendMessage("error.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error("error please try again:", error);
    api.sendMessage("error:", event.threadID, event.messageID);
  }
}

async function convertImageToCaption(imageURL, api, event) {
  try {
    api.sendMessage("📷 Recognitioning image, please wait...", event.threadID);

    const response = await axios.get(`https://combineapi-7fa2b2874c53.herokuapp.com/api/image2text/new?image=${encodeURIComponent(imageURL)}`);
    const caption = response.data.caption.generated_text;

    if (caption) {
      api.sendMessage(`📷 Image Context\n\n ${caption}`, event.threadID, event.messageID);
    } else {
      api.sendMessage("Failed to convert image.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error("Error recognition image:", error);
    api.sendMessage("error recognition image", event.threadID, event.messageID);
  }
}

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body?.toLowerCase()?.startsWith("llama"))) return;


  const args = event.body.split(/\s+/);
  args.shift();

  if (event.type === "message_reply") {
    if (event.messageReply.attachments[0]) {
      const attachment = event.messageReply.attachments[0];

      if (attachment.type === "audio") {
        const audioUrl = attachment.url;
        convertVoiceToText(audioUrl, api, event);
        return;
      } else if (attachment.type === "photo") {
        const imageURL = attachment.url;
        convertImageToCaption(imageURL, api, event);
        return;
      }
    }
  }

  const inputText = args.join(' ');

  if (!inputText) {
    return api.sendMessage("Hi, I'm Llama Assistant, How Can I Help You?", event.threadID);
  }

  api.sendMessage("Llama is thinking, please wait...", event.threadID);

  try {
    const response = await axios.get(`https://markdevs-api.onrender.com/api/llama?inputText=${inputText}`);
    if (response.status === 200) {
      const generatedText = response.data.response;
      api.sendMessage(`𝗟𝗹𝗮𝗺𝗮 𝗔𝗜\n\n${generatedText}`, event.threadID);
    } else {
      console.error("Error generating reply from llama API");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports.run = async function ({ api, event }) {};
