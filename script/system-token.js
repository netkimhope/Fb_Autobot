const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: 'bot-token',
  role: 3,
  version: '1.0.0',
  info: 'facebook bot token system configuration',
  type: 'configuration',
  aliases: ['revoke', 'update-token'],
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (args.length !== 1) {
      api.sendMessage("Please provide the new access token.", event.threadID, event.messageID);
      return;
    }

    const newAccessToken = args[0];
    const systemDir = path.resolve(__dirname, "system");
    const configPath = path.join(systemDir, "fbtoken.txt");

    if (!fs.existsSync(systemDir)) {
      fs.mkdirSync(systemDir);
    }

    fs.writeFileSync(configPath, newAccessToken, 'utf-8');

    api.sendMessage("Access token replaced or created successfully.", event.threadID);
  } catch (error) {
    console.error("Error replacing or creating access token:", error);
    api.sendMessage("An error occurred while replacing or creating the access token.", event.threadID);
  }
};
