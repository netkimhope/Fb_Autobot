const { Hercai } = require('hercai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { DateTime } = require('luxon');

const herc = new Hercai();

module.exports.config = {
    name: "prodia",
    version: "1.0.1-beta",
    aliases: ["lexica", "cai"],
    role: 0,
    credits: "Kenneth Panio",
    info: "Generate images or drawings with different models based on the prompt.",
    type: "artificial-intelligence",
    usage: "[prompt]",
    cd: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const prompt = args.join(" ").toLowerCase();

    if (!prompt) {
        return api.sendMessage("Please provide a prompt for prodia.", event.threadID, event.messageID);
    } else {
    api.setMessageReaction("🕣", messageID, () => {}, true);
    api.sendMessage("🕣 | 𝘈𝘯𝘴𝘸𝘦𝘳𝘪𝘯𝘨....", threadID, messageID);
  }
  
    try {
        const modelNameMap = {
            "anime": "animefy",
            "lexica": "lexica",
            "prodia": "prodia",
            "simurg": "simurg",
            "raava": "raava",
            "shonin": "shonin",
        };

        let modelName = "DALL-E"; // Default to DALL-E
        for (const key in modelNameMap) {
            if (prompt.includes(key)) {
                modelName = modelNameMap[key];
                break;
            }
        }

        const imageResponse = await herc.drawImage({ model: modelName, prompt });

        const imageUrl = imageResponse?.url;

        if (imageUrl && ["send pic", "send a pic", "draw a", "genimage", "drawing", "picture of", "image of", "send me pic", "send me image", "send me an image", "make a drawing", "illustrate", "sketch", "painting", "wallpaper", "photo of", "generate", "drawing of", "artwork", "artwork of", "visual image", "visual photo", "send me a pic"].some(phrase => prompt.includes(phrase))) {
            const imageStream = await axios.get(imageUrl, { responseType: 'stream' });
            api.sendMessage({
                body: `🖼️Sure!  Here's a drawing in ${modelName || 'Simple'} Artstyle`,
                attachment: imageStream.data,
            }, event.threadID);
        } else {
            const questionResponse = await herc.question({ model: "v3", content: prompt });
            api.sendMessage(questionResponse.reply, event.threadID);

            const beastUrl = 'https://www.api.vyturex.com/beast';

            try {
                const beastResponse = await axios.get(`${beastUrl}?query=${encodeURIComponent(questionResponse.reply)}`);
                const audioURL = beastResponse?.data?.audio;

                if (audioURL) {
                    const fileName = "mrbeast_voice.mp3";
                    const filePath = path.resolve(__dirname, 'cache', fileName);

                    const { data: audioData } = await axios.get(audioURL, { responseType: 'arraybuffer' });
                    fs.writeFileSync(filePath, audioData);

                    api.sendMessage({
                        body: "💽 𝗩𝗼𝗶𝗰𝗲",
                        attachment: fs.createReadStream(filePath)
                    }, event.threadID, (voiceError) => {
                        if (voiceError) console.error('Error sending voice response:', voiceError);
                        fs.unlinkSync(filePath);
                    });
                } else {
                    console.error("Failed to fetch Beast API response.");
                }
            } catch (beastError) {
                console.error('Error during Beast API request:', beastError);
            }
        }
    } catch (error) {
        console.error('Error during prodia request:', error);
        api.sendMessage("Error generating image or drawing with prodia.", event.threadID);
    }
};
