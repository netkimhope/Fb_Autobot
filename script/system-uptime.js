const fs = require("fs");
const path = require("path");
const os = require("os");

const historyFilePath = path.resolve(__dirname, '..', 'data', 'history.json');

let historyData = [];

try {
  historyData = require(historyFilePath);
} catch (readError) {
  console.error('Error reading history.json:', readError);
}

module.exports.config = {
  name: 'active-session',
  aliases: ["listusers", "listbots", "activeusers", "list-users", "bot-users", "active-users", "active-bots", "list-bot", "listbot", "uptime", "botstatus"],
  info: 'List all active bots in the history session.',
  type: "System",
  version: '1.4.0', // Incremented version
  role: 0,
  cd: 0
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  if (historyData.length === 0) {
    api.sendMessage('No users found in the history configuration.', threadID, messageID);
    return;
  }

  const currentUserId = api.getCurrentUserID();
  const mainBotIndex = historyData.findIndex(user => user.userid === currentUserId);

  if (mainBotIndex === -1) {
    api.sendMessage('Main bot not found in history.', threadID, messageID);
    return;
  }

  const mainBot = historyData[mainBotIndex];
  const mainBotName = await getUserName(api, currentUserId); // Fetch main bot's name dynamically
  const mainBotOSInfo = getOSInfo(); // Get detailed OS information for the main bot
  const mainBotRunningTime = convertTime(mainBot.time); // Convert main bot's running time to days and minutes

  const userPromises = historyData
    .filter((user) => user.userid !== currentUserId) // Exclude the main bot
    .map(async (user, index) => {
      const userName = await getUserName(api, user.userid);
      const userRunningTime = convertTime(user.time); // Convert each user's running time to days and minutes
      return `${index + 1}. 𝗡𝗔𝗠𝗘: ${userName}\n𝗜𝗗: ${user.userid}\n𝗨𝗣𝗧𝗜𝗠𝗘: ${userRunningTime}`;
    });

  const userList = (await Promise.all(userPromises)).filter(Boolean); // Filter out undefined entries
  const userCount = userList.length;

  const userMessage = `𝗠𝗔𝗜𝗡𝗕𝗢𝗧: ${mainBotName}\n𝗜𝗗: ${currentUserId} \n𝗕𝗢𝗧 𝗥𝗨𝗡𝗡𝗜𝗡𝗚: ${mainBotRunningTime}\n\n| SYSTEM |\n\n${mainBotOSInfo}\n\n𝗢𝗧𝗛𝗘𝗥 𝗦𝗘𝗦𝗦𝗜𝗢𝗡[${userCount}]\n\n${userList.join('\n')}`;

  api.sendMessage(userMessage, threadID, messageID);
};

async function getUserName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);
    return userInfo && userInfo[userID] ? userInfo[userID].name : "unknown";
  } catch (error) {
    return "unknown";
  }
}

function getOSInfo() {
  const osInfo = `${os.type()} ${os.release()} ${os.arch()} (${os.platform()})`;
  const totalMemory = formatBytes(os.totalmem());
  const freeMemory = formatBytes(os.freemem());
  return `OS: ${osInfo}\nCPU: ${os.cpus()[0].model}\nCores: ${os.cpus().length}\nTotal Memory: ${totalMemory}\nFree Memory: ${freeMemory}`;
}

function convertTime(timeValue) {
  const totalSeconds = parseInt(timeValue, 10);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const remainingHours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${days} days ${remainingHours} hours ${remainingMinutes} minutes ${remainingSeconds} seconds`;
}


function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + sizes[i];
}
