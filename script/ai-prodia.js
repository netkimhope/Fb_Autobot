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
    }

    api.sendMessage("🕣 | Answering...", event.threadID, event.messageID);

    try {
        let modelName = "DALL-E"; // Default to DALL-E
        let imageResponse;

        if (prompt.includes("anime")) {
            modelName = "animefy";
        } else if (prompt.includes("lexica")) {
            modelName = "lexica";
        } else if (prompt.includes("prodia")) {
            modelName = "prodia";
        } else if (prompt.includes("simurg")) {
            modelName = "simurg";
        } else if (prompt.includes("raava")) {
            modelName = "raava";
        } else if (prompt.includes("shonin")) {
            modelName = "shonin";
        }

        imageResponse = await herc.drawImage({ model: modelName, prompt });

        const imageUrl = imageResponse && imageResponse.url;

        if (imageUrl && (prompt.includes("send pic") || prompt.includes("send a pic") || prompt.includes("draw a") || prompt.includes("genimage") || prompt.includes("drawing") || prompt.includes("picture of") || prompt.includes("image of"))) {
            const imageStream = await axios.get(imageUrl, { responseType: 'stream' });
            api.sendMessage({
                body: `🖼️ Here's Image from ${modelName || 'Undefined Model'}`,
                attachment: imageStream.data,
            }, event.threadID);
        } else {
            const questionResponse = await herc.question({ model: "v3", content: prompt });
            api.sendMessage(questionResponse.reply, event.threadID);

            // Mrbeast Voice
            const beastUrl = 'https://www.api.vyturex.com/beast';
            try {
                const beastResponse = await axios.get(`${beastUrl}?query=${encodeURIComponent(questionResponse.reply)}`);
                if (beastResponse.data && beastResponse.data.audio) {
                    const audioURL = beastResponse.data.audio;
                    const fileName = "mrbeast_voice.mp3";
                    const filePath = path.resolve(__dirname, 'cache', fileName);

                    const { data: audioData } = await axios.get(audioURL, { responseType: 'arraybuffer' });
                    fs.writeFileSync(filePath, audioData);

                    api.sendMessage({
                        body: "💽 𝗩𝗼𝗶𝗰𝗲",
                        attachment: fs.createReadStream(filePath)
                    }, event.threadID, async (voiceError) => {
                        if (voiceError) {
                            console.error('Error sending voice response:', voiceError);
                        }

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
