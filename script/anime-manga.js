const axios = require('axios');
const fs = require('fs').promises;

module.exports.config = {
  name: "manga",
  version: "1.0",
  role: 0,
  info: "Read Manga",
  type: "anime",
  usage: "[searchQuery] or [help] to show usage",
  cd: 5,
};

const mangaData = {};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  if (args[0] === 'help') {
    return api.sendMessage("Search Manga\n\nUsage:\nmanga [searchQuery]\n\nExample:\nmanga One Piece", threadID, messageID);
  }

  try {
    const searchQuery = args.join(' ');

    const response = await axios.get(`https://api.consumet.org/manga/mangadex/${searchQuery}`);
    const results = response.data.results;

    if (!results.length) {
      return api.sendMessage("No results found!", threadID, messageID);
    }

    const totalPages = Math.ceil(results.length / 5);
    let resultString = '';

    const currentPageData = await paginate(results, 1, 5);
    currentPageData.forEach((data, index) => {
      resultString += index + 1 + ". " + getMangaDisplayInfo(data) + "\n";
    });

    mangaData[threadID] = {
      resultString: results,
      pagetype: true,
      page: 1,
      searchStatus: false,
      currentPageData: currentPageData,
    };

    await api.sendMessage("Results:\n--------------------------\n" + resultString + "Current page 1 of " + totalPages + " page/s.\n(Reply to this message. Ex: Page 2/Select 2/Done)", threadID, (error, message) => {
      if (!error) {
        api.setMessageReaction('❤️', message.messageID, () => {}, true);
      } else {
        console.error("Error sending message:", error);
      }
    });

  } catch (error) {
    console.error("Error fetching manga information:", error);
    api.sendMessage("An error occurred while fetching manga information.", threadID);
  }
};

function getMangaDisplayInfo(mangaData) {
  return `Title: ${mangaData.title}\nDescription: ${mangaData.description}\nStatus: ${mangaData.status}\nRelease Date: ${mangaData.releaseDate}\n`;
}

async function paginate(data, page, itemsPerPage) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
}

module.exports.handleReply = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  try {
    const replyData = mangaData[threadID];

    if (!replyData || !replyData.pagetype) {
      return; 
    }

    const [action, pageNumber, selection] = args.map(arg => arg.toLowerCase());

    if (action === 'page' && !isNaN(pageNumber)) {
      const page = parseInt(pageNumber);
      if (page >= 1 && page <= Math.ceil(replyData.resultString.length / 5)) {
        const currentPageData = await paginate(replyData.resultString, page, 5);
        let resultString = '';
        currentPageData.forEach((data, index) => {
          resultString += index + 1 + ". " + getMangaDisplayInfo(data) + "\n";
        });

        mangaData[threadID] = {
          ...replyData,
          page: page,
          currentPageData: currentPageData,
        };

        await api.sendMessage(`Results:\n--------------------------\n${resultString}Current page ${page} of ${Math.ceil(replyData.resultString.length / 5)} page/s.\n(Reply to this message. Ex: Page 2/Select 2/Done)`, threadID, (error, updatedMessage) => {
          if (!error) {
            api.setMessageReaction('❤️', updatedMessage.messageID, () => {}, true);
          } else {
            console.error("Error sending message:", error);
          }
        });
      } else {
        api.sendMessage(`Invalid page number. Total pages: ${Math.ceil(replyData.resultString.length / 5)}`, threadID, messageID);
      }
    } else if (action === 'select' && !isNaN(selection)) {
      const index = parseInt(selection) - 1;
      if (index >= 0 && index < replyData.currentPageData.length) {
        const selectedManga = replyData.currentPageData[index];

        const detailedInfoResponse = await axios.get(`https://api.consumet.org/manga/mangadex/info/${selectedManga.ID}`);
        const detailedInfo = detailedInfoResponse.data;

        const description = `Title: ${detailedInfo.title}\nDescription: ${detailedInfo.description.en}\nGenres: ${detailedInfo.genres.join(", ")}\nThemes: ${detailedInfo.themes.join(", ")}\nStatus: ${detailedInfo.status}\nRelease Date: ${detailedInfo.releaseDate}\nChapters: ${detailedInfo.chapters.length}`;
        
        const imagePath = await downloadImage(detailedInfo.image);
        
        await api.sendMessage({
          body: description,
          attachment: fs.createReadStream(imagePath),
        }, threadID);

        await fs.unlink(imagePath);
        
      } else {
        api.sendMessage("Invalid item number⚠️", threadID, messageID);
      }
    } else if (action === 'done') {
      await api.unsendMessage(messageID);
      api.setMessageReaction('✅', messageID, () => {}, true);
    } else {
      api.sendMessage("Invalid input!⚠️\nEx: Page 2/Select 2/Done", threadID, messageID);
    }
  } catch (error) {
    console.error("Error handling manga reply:", error);
    api.sendMessage("An error occurred while processing your request.", threadID);
  }
};

async function downloadImage(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const imagePath = `./cache/${Date.now()}.jpg`;
  await fs.writeFile(imagePath, Buffer.from(response.data));
  return imagePath;
}
