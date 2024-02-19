const axios = require('axios');
const scholarly = require('scholarly');

module.exports.config = {
  name: "google-scholar",
  version: "1.0.0",
  info: "Search Google Scholar for articles on a specific topic",
  credits: "Kenneth Panio",
  type: "info",
  role: 0,
  aliases: ['gscholar', 'scholar', 'citation', 'cite'],
  usage: "[topic]"
};

module.exports.run = async ({ api, event, args }) => {
  try {
    if (!args[0]) {
      return api.sendMessage("Please provide a topic to search on Google Scholar.", event.threadID);
    }

    const topic = args.join(' ');
    const searchResults = await scholarly.search(topic);
    const limitedResults = searchResults.slice(0, 5); // Limiting to 5 articles

    let messageText = '';
    limitedResults.forEach((article, index) => {
      messageText += `${index + 1}. 📚 **${article.title}**\n👥 *Authors:* ${article.authors.join(', ')}\n📅 *Year:* ${article.year}\n🔗 *URL:* ${article.url}\n\n`;
    });
    api.sendMessage(messageText, event.threadID);
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage("Failed to perform Google Scholar search, please try again.", event.threadID);
  }
};