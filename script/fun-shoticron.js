const axios = require('axios');
const fs = require('fs');
const path = require('path');

let animeAutoInterval;
const cacheDir = path.join(__dirname, 'cache');
fs.mkdirSync(cacheDir, { recursive: true });

module.exports.config = {
  name: 'shoticron',
  aliases: ["shawty", "shoti", "vitamins", "dalaga", "dilag", "vitamin", "dalagita"],
  version: '1.0',
  role: 0,
  credits: '𝙼𝙰𝚁𝙹𝙷𝚄𝙽 𝙱𝙰𝚈𝙻𝙾𝙽',
  info: 'Random shawty Video mga binibining dalagita',
  type: 'fun',
  usage: '',
  cd: 10,
};

const sendRandomAnimeVideo = async (api, threadID) => {
  try {
    const response = await axios.post('https://shoti-srv1.onrender.com/api/v1/get', { apikey: "$shoti-1hmr8u21d4bo13buo7g" });
    const videoInfo = response.data;
    const videoUrl = videoInfo.data.url;
    
    //api documentation: https://shoti-api.deno.dev

    const videoFileName = `video_${Date.now()}.mp4`;
    const videoFilePath = path.join(cacheDir, videoFileName);

    const videoStreamResponse = await axios.get(videoUrl, { responseType: 'stream' });
    const videoData = videoStreamResponse.data;

    const writeStream = fs.createWriteStream(videoFilePath);
    videoData.pipe(writeStream);

    writeStream.on('finish', () => {
      const message = {
        body: '🌸 ʏᴏᴜʀ ᴠɪᴅᴇᴏ sᴇɴsᴇɪ 🌸',
        attachment: fs.createReadStream(videoFilePath),
      };

      api.sendMessage(message, threadID, () => {
        fs.unlink(videoFilePath, (err) => {
          if (err) {
            console.error('Error deleting cached video file:', err);
          }
        });
      });
    });
  } catch (error) {
    console.error('Error fetching or sending the video:', error);
    api.sendMessage('Error sending the video.', threadID);
  }
};

module.exports.run = ({ api, event }) => {
  const commandStatus = event.body.toLowerCase().split(' ')[1];

  if (commandStatus === 'on') {
    if (animeAutoInterval) {
      api.sendMessage('🌸|•ᴄᴏᴍᴍᴀɴᴅ ғᴇᴀᴛᴜʀᴇ ɪs ᴀʟʀᴇᴀᴅʏ ᴛᴜʀɴᴇᴅ ᴏɴ', event.threadID);
    } else {
      api.sendMessage('🌸|•ᴄᴏᴍᴍᴀɴᴅ ғᴇᴀᴛᴜʀᴇ ɪs ᴛᴜʀɴᴇᴅ ᴏɴ, ᴡɪʟʟ sᴇɴᴅ ᴠɪᴅᴇᴏ ᴇᴠᴇʀʏ 1 ᴍɪɴᴜᴛᴇ', event.threadID);

      sendRandomAnimeVideo(api, event.threadID);

      animeAutoInterval = setInterval(() => {
        sendRandomAnimeVideo(api, event.threadID);
      }, 60000);
    }
  } else if (commandStatus === 'off') {
    if (animeAutoInterval) {
      clearInterval(animeAutoInterval);
      animeAutoInterval = undefined;
      api.sendMessage('🌸|•ᴄᴏᴍᴍᴀɴᴅ ғᴇᴀᴛᴜʀᴇ ɪs ᴛᴜʀɴᴇᴅ ᴏғғ', event.threadID);
    } else {
      api.sendMessage('🌸|•ᴄᴏᴍᴍᴀɴᴅ ғᴇᴀᴛᴜʀᴇ ɪs ᴀʟʀᴇᴀᴅʏ ᴛᴜʀɴᴇᴅ ᴏғғ', event.threadID);
    }
  } else {
    api.sendMessage('🌸|•ɪɴᴠᴀʟɪᴅ ᴄᴏᴍᴍᴀɴᴅ. ᴜsᴇ "shoticron on" ᴏʀ "shoticron off"', event.threadID);
  }
};
