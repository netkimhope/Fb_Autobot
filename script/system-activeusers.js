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
  name: 'active-session',
  aliases: ['lu'],
  info: 'list all active bots in the history session',
  type: "Utility",
  usages: ["listusers", "listbots", "activeusers", "list-users", "bot-users", "active-users", "active-bots", "list-bot", "listbot"],
  version: '1.0.0', 
  role: 0,
  cd: 0
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  if (historyData.length === 0) {
    api.sendMessage('No users found in the history configuration.', threadID, messageID);
    return;
  }

  const userPromises = historyData.map(async (user, index) => {
    const userName = await getUserName(api, user.userid);
    return `${index + 1}. Name: ${userName} | ID: ${user.userid}`;
  });

  const userList = await Promise.all(userPromises);
  const userCount = userList.length;

  const userMessage = `Active Bots Session [${userCount}]\n\n${userList.join('\n')}`;

  api.sendMessage(userMessage, threadID, messageID);
};

async function getUserName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);
    if (userInfo && userInfo[userID]) {
      return userInfo[userID].name;
    } else {
      return "unknown";
    }
  } catch (error) {
    return "unknown";
  }
}
