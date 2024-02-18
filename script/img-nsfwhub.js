const axios = require('axios');
const { NSFW } = require("nsfwhub");

const nsfw = new NSFW();
const excludedCategories = ["gay", "dick", "pegged", "lesbian", "futa"];

const categories = [
  "ass", "sixtynine", "pussy", "anal", "boobs", "bdsm", "black", "easter", "bottomless", "blowjob", "collared", "cum",
  "cumsluts", "dp", "dom", "extreme", "feet", "finger", "fuck", "gif", "group", "hentai", "kiss", "lick", "phgif", "puffies", "real",
  "suck", "tattoo", "tiny", "toys", "xmas"
];

module.exports.config = {
  name: "nsfwhub",
  version: "1.0.0",
  role: 0,
  credits: "Kenneth Panio",
  info: "Fetch NSFW images from nsfwhub",
  usage: "[category]",
  cd: 0,
  aliases: ["nsfw", "adult", "sexy", "r18"]
};

module.exports.run = async function ({ api, event, args }) {
  function reply(msg) {
    api.sendMessage(msg, event.threadID, event.messageID);
  }

  if (args[0] === "help") {
    const categoryList = categories.join(', ');
    return reply(`NSFWHub Command Usage:\n- To fetch a specific category: \`nsfwhub [category]\`\n- To fetch a random category: \`nsfwhub\`\n- List of available categories: ${categoryList}`);
  }

  const selectedCategory = args[0];
  const isRandom = !selectedCategory;

  if (isRandom) {
    const filteredCategories = categories.filter(category => !excludedCategories.includes(category));
    const category = filteredCategories[Math.floor(Math.random() * filteredCategories.length)];
    return fetchAndSend(category);
  }

  if (!categories.includes(selectedCategory)) {
    return reply(`Invalid category. Use \`nsfwhub help\` to see available categories.`);
  }

  fetchAndSend(selectedCategory);

  async function fetchAndSend(category) {
    try {
      const data = await nsfw.fetch(category);
      const response = await axios.get(data.image.url, { responseType: 'stream' });
      api.sendMessage({ attachment: response.data }, event.threadID);
    } catch (error) {
      console.error('Error fetching NSFW image:', error.message);
      reply('Error fetching NSFW image. Please try again later.');
    }
  }
};
