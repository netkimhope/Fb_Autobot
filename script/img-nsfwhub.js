const { NSFW } = require("nsfwhub");

const nsfw = new NSFW();

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
    const categories = [
      "ass", "sixtynine", "pussy", "dick", "anal", "boobs", "ass",
      "bdsm", "black", "easter", "bottomless", "blowjob", "collared", "cum",
      "cumsluts", "dp", "dom", "extreme", "feet", "finger", "fuck", "futa",
      "gay", "gif", "group", "hentai", "kiss", "lesbian", "lick", "pegged",
      "phgif", "puffies", "real", "suck", "tattoo", "tiny", "toys", "xmas"
    ];

    const categoryList = categories.join(', ');

    return reply(`NSFWHub Command Usage:\n- To fetch a specific category: \`nsfwhub [category]\`\n- To fetch a random category: \`nsfwhub\`\n- List of available categories: ${categoryList}`);
  }

  const category = args[0] || categories[Math.floor(Math.random() * categories.length)];

  if (!categories.includes(category)) {
    return reply(`Invalid category. Use \`nsfwhub help\` to see available categories.`);
  }

  try {
    const data = await nsfw.fetch(category);

    const response = await axios.get(data.image.url, { responseType: 'stream' });
    api.sendMessage({ attachment: response.data }, event.threadID);
  } catch (error) {
    console.error('Error fetching NSFW image:', error.message);
    reply('Error fetching NSFW image. Please try again later.');
  }
};
