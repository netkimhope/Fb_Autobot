const fs = require("fs");
const path = require("path");

const historyFilePath = path.resolve(__dirname, '..', 'data', 'history.json');

let historyData = [];

try {
  historyData = require(historyFilePath);
} catch (readError) {
  console.error('Error reading history.json:', readError);
}

module.exports.config = {
  name: 'cmds',
  aliases: ['cmdconfig', 'ec'],
  info: 'on or off bot command according its name',
  type: "Configuration",
  usages: ["[on/off] [name]", "cmds list all"],
  version: '1.2.0', 
  role: 1,
  cd: 0
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const botID = api.getCurrentUserID();

  const botIndex = historyData.findIndex(user => user.userid === botID);

  if (botIndex === -1) {
    api.sendMessage('Bot user not found in the history configuration.', threadID, messageID);
    return;
  }

  const botUser = historyData[botIndex];

  const [action, commandNameOrPage] = args;

  switch (action) {
    case 'on':
      if (!botUser.enableCommands) {
        botUser.enableCommands = [{ commands: [commandNameOrPage] }];
      } else {
        const existingCommands = botUser.enableCommands[0].commands;
        if (!existingCommands.includes(commandNameOrPage)) {
          existingCommands.push(commandNameOrPage);
        } else {
          api.sendMessage(`Command "${commandNameOrPage}" is already enabled.`, threadID, messageID);
          return;
        }
      }
      break;

    case 'off':
      if (botUser.enableCommands && botUser.enableCommands[0].commands.includes(commandNameOrPage)) {
        botUser.enableCommands[0].commands = botUser.enableCommands[0].commands.filter(cmd => cmd !== commandNameOrPage);
      } else {
        api.sendMessage(`Command "${commandNameOrPage}" is not currently enabled.`, threadID, messageID);
        return;
      }
      break;

    case 'list':
      if (!botUser.enableCommands || botUser.enableCommands.length === 0) {
        api.sendMessage('No commands are currently enabled.', threadID, messageID);
        return;
      }

      const allCommands = botUser.enableCommands[0].commands;
      const perPage = 5;

      if (commandNameOrPage === 'all') {
        api.sendMessage(`All Enabled Commands:\n${allCommands.join(', ')}`, threadID, messageID);
      } else {
        const totalPages = Math.ceil(allCommands.length / perPage);
        const pageNumber = parseInt(commandNameOrPage) || 1;

        if (pageNumber < 1 || pageNumber > totalPages) {
          api.sendMessage(`Invalid page number. Use "list all" for all commands.`, threadID, messageID);
          return;
        }

        const startIndex = (pageNumber - 1) * perPage;
        const endIndex = startIndex + perPage;
        const pageCommands = allCommands.slice(startIndex, endIndex);

        api.sendMessage(`Enabled Commands (Page ${pageNumber}/${totalPages}):\n${pageCommands.join(', ')}`, threadID, messageID);
      }
      break;

    default:
      api.sendMessage('Invalid action. Use "on", "off", "list [page number]", or "list all".', threadID, messageID);
      return;
  }

  updateHistoryFile();
  api.sendMessage(`Command "${commandNameOrPage}" turned ${action === 'on' ? 'on' : 'off'} successfully.`, threadID, messageID);

  function updateHistoryFile() {
    fs.writeFileSync(historyFilePath, JSON.stringify(historyData, (key, value) => {
      if (key === "commands" && Array.isArray(value)) {
        return value;
      } else {
        return value;
      }
    }, 2));
  }
};
