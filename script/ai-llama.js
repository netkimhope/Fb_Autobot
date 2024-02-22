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

module.exports.run = async function ({ api, event, args }) {
    const prompt = args.join(" ");

    if (!prompt) {
        return api.sendMessage("Please provide a prompt for the llama.", event.threadID, event.messageID);
    } else {
        api.setMessageReaction("🕣", messageID, () => {}, true);
        api.sendMessage("🕣 | 𝘈𝘯𝘴𝘸𝘦𝘳𝘪𝘯𝘨....", threadID, messageID);
      }

    try {
        const response = await axios.get(`https://llama.aliestercrowley.com/api?prompt=${encodeURIComponent(prompt)}`);
        const llamaResponse = response.data.response;

        const message = {
            body: llamaResponse
        };

        api.sendMessage(message, event.threadID, event.messageID);

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
                    body: '💽𝗩𝗼𝗶𝗰𝗲 𝗕𝗼𝘅',
                    attachment: fs.createReadStream(filePath),
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
