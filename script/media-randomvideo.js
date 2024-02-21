const axios = require("axios");
const fs = require("fs");
const path = require("path");
const randomUserAgent = require('random-useragent');

module.exports.config = {
  name: 'random-video',
  role: 0,
  version: '0.1.0',
  info: 'sends a random video',
  type: 'media',
  aliases: ['randomvids', 'funvideo', 'tv', 'reels', 'reel', 'random-content'],
};

const systemDir = path.resolve(__dirname, "system");
const contentFilePath = path.resolve(systemDir, "content.json");
const pageIdsFilePath = path.resolve(systemDir, "pageIds.json");
const configPath = path.resolve(systemDir, "fbtoken.txt");
const accessToken = fs.readFileSync(configPath, 'utf-8').trim();
const tempDir = path.resolve(__dirname, "cache");

if (!fs.existsSync(systemDir)) {
  fs.mkdirSync(systemDir);
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Load previously sent video data from the file
const contentData = fs.existsSync(contentFilePath) ? JSON.parse(fs.readFileSync(contentFilePath, 'utf-8')) : { videos: [], timestamps: [] };

// Load page IDs from the file
let pageIds = fs.existsSync(pageIdsFilePath) ? JSON.parse(fs.readFileSync(pageIdsFilePath, 'utf-8')) : [];

// asynchronous function
module.exports.run = async function ({ api, event, args }) {
  function box(message) {
    api.sendMessage({ body: message }, event.threadID, event.messageID);
  }

  try {
    if (args[0] === "add") {
      const pageIdToAdd = args[1];
      if (pageIdToAdd) {
        pageIds.push(pageIdToAdd);
        fs.writeFileSync(pageIdsFilePath, JSON.stringify(pageIds, null, 2));
        await box(`Page ID "${pageIdToAdd}" added successfully.`);
      } else {
        await box("Please provide a page ID to add.");
      }
      return;
    }

    if (args[0] === "del") {
      const pageIdToDelete = args[1];
      if (pageIdToDelete) {
        pageIds = pageIds.filter(id => id !== pageIdToDelete);
        fs.writeFileSync(pageIdsFilePath, JSON.stringify(pageIds, null, 2));
        await box(`Page ID "${pageIdToDelete}" deleted successfully.`);
      } else {
        await box("Please provide a page ID to delete.");
      }
      return;
    }

    if (args[0] === "list") {
      await box("Available page IDs:\n" + pageIds.join("\n"));
      return;
    }

    if (pageIds.length === 0) {
      await box("No page IDs available. Please add page IDs using 'random-video add [pageID]'.");
      return;
    }

    const randomPageId = pageIds[Math.floor(Math.random() * pageIds.length)];
    const loadingMessage = await box("Sending random reels video, please wait...");

    const response = await axios.get(`https://graph.facebook.com/${randomPageId}/videos`, {
  params: {
    access_token: accessToken,
  },
  headers: {
    'User-Agent': randomUserAgent.getRandom(),
  },
});

    const videos = response.data.data;

    if (videos.length > 0) {
      const currentTime = Date.now();
      const oneHourInMillis = 60 * 60 * 1000; // 1 hour in milliseconds

      for (let i = contentData.videos.length - 1; i >= 0; i--) {
        const sentTimestamp = contentData.timestamps[i];
        const elapsedTime = currentTime - sentTimestamp;

        if (elapsedTime >= oneHourInMillis) {
          contentData.videos.splice(i, 1);
          contentData.timestamps.splice(i, 1);
        }
      }

      const sentVideoIds = new Set(contentData.videos);
const unsentVideos = videos.filter(video => !sentVideoIds.has(video.id));

      if (unsentVideos.length === 0) {
        await box("No More Videos Found! Please Try Again! or use the command after 1 hour!");
      } else {
        const randomVideo = unsentVideos[Math.floor(Math.random() * unsentVideos.length)];
        const link = randomVideo.source;
        const videoId = randomVideo.id;
        const name = randomVideo.from.name;
        const caption = randomVideo.description || 'pogi si kenneth panio';

        const videoResponse = await axios({
  method: "GET",
  url: link,
  responseType: "stream",
  headers: {
    'User-Agent': randomUserAgent.getRandom(),
  },
});

        const randomFileName = `video_${currentTime}_${videoId}.mp4`;
        const filePath = path.join(tempDir, randomFileName);

        const writeStream = fs.createWriteStream(filePath);
        videoResponse.data.pipe(writeStream);

        await new Promise(resolve => {
          writeStream.on("finish", resolve);
        });

        if (fs.existsSync(filePath)) {
          await box(`ᴘᴀɢᴇɴᴀᴍᴇ: ${name}\nᴜsᴇʀɴᴀᴍᴇ: ${randomPageId}\nᴄᴀᴘᴛɪᴏɴ: ${caption}`);
          await api.sendMessage(
            {
              attachment: fs.createReadStream(filePath),
            },
            event.threadID
          );

          contentData.videos.push(videoId);
          contentData.timestamps.push(currentTime);
          fs.writeFileSync(contentFilePath, JSON.stringify(contentData, null, 2));

          fs.unlinkSync(filePath);
        } else {
          console.error("File does not exist:", filePath);
          await box("An error occurred while fetching the video. Please try again later.");
        }
      }
    } else {
      await box("No videos found.");
    }
  } catch (error) {
    console.error("Error retrieving or sending videos:", error);
    await box("An error occurred while retrieving or sending videos. Please check your configuration.");
  }
};