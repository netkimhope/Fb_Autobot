const axios = require('axios');

module.exports.config = {
  name: "urban-dictionary",
  aliases: ["urban-define", "urban-meaning", "urban-word", "urbanword", "urbandefine", "urbanterm", "urban-term"],
  version: "1.0.0",
  role: 0,
  credits: "Reiko Dev",
  info: "Retrieve definitions from Urban Dictionary",
  type: "info",
  usage: "[term]",
  cd: 5,
};

module.exports.run = async function({
  api,
  event,
  args
}) {
  const term = args.join(" ");

  if (!term) {
    return api.sendMessage("Please provide a term to search for.", event.threadID, event.messageID);
  }

  try {
    const response = await require("axios").get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);
    const definitions = response.data.list;

    if (definitions.length > 0) {
      let msg = `Urban Dictionary definitions for "${term}":\n`;

      definitions.forEach((item, index) => {
        msg += `\n${index + 1}. ${item.definition}\nExample: ${item.example}\nAuthor: ${item.author}\nVotes: 👍 ${item.thumbs_up}  👎 ${item.thumbs_down}\n`;

        if (index < definitions.length - 1) {
          msg += "------------------------";
        }
      });

      api.sendMessage(msg, event.threadID, event.messageID);
    } else {
      api.sendMessage(`No definitions found for '${term}' on Urban Dictionary.`, event.threadID, event.messageID);
    }
  } catch (error) {
    api.sendMessage("An error occurred while fetching the definition. Please try again later.", event.threadID, event.messageID);
  }
};
