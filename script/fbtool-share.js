const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');

module.exports.config = {
  name: "fbshare",
  aliases: ["share", "sharehandle", "shareboost", "spamshare"],
  version: "0.0.1",
  role: 0,
  credits: "Reiko Dev",
  info: "boosting shares on Facebook Post! with multiplexer method",
  type: "fbtool",
  usage: "[link] [token] [amount] [interval (optional)]",
  cd: 16,
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const userID = '61550873742628';
    const senderID = event.senderID;
    const systemFolderPath = './system';
    const usageDataPath = path.join(systemFolderPath, 'fbshare.json');

    if (!fs.existsSync(systemFolderPath)) {
      fs.mkdirSync(systemFolderPath);
    }

    let usageData = {};

    try {
      const data = fs.readFileSync(usageDataPath);
      usageData = JSON.parse(data);
    } catch (err) {
      console.log('Creating new usageData file.');
      fs.writeFileSync(usageDataPath, JSON.stringify(usageData));
    }

    // Check daily limit
    if (!usageData[senderID]) {
      usageData[senderID] = { count: 0, lastTimestamp: 0 };
    }

    const currentDateInPH = moment().tz('Asia/Manila').format('YYYY-MM-DD');

    if (usageData[senderID].lastTimestamp !== currentDateInPH) {
      // Reset count for a new day
      usageData[senderID].count = 0;
      usageData[senderID].lastTimestamp = currentDateInPH;
    }

    const dailyLimit = senderID === userID ? Infinity : 5; // Set daily limit to Infinity if senderID and userID match

    if (usageData[senderID].count >= dailyLimit) {
      api.sendMessage(`Daily limit reached. You can use boost share up to ${dailyLimit} times per day.`, event.threadID);
      return;
    }

    // Increment usage count
    usageData[senderID].count++;

    // Save updated usage data
    fs.writeFileSync(usageDataPath, JSON.stringify(usageData));

    // Rest of your existing code...
    if (args.length < 3 || args.length > 4) {
      api.sendMessage('Invalid number of arguments. Usage: !fbshare [link] [token] [amount] [interval (optional)]', event.threadID);
      return;
    }

    const shareUrl = args[0];
    const accessToken = args[1];
    const shareAmount = senderID === userID ? Infinity : parseInt(args[2]); // Set shareAmount to Infinity if senderID and userID match
    const customInterval = args[3] ? parseInt(args[3]) : 1;

    const nohupCommand = `nohup node fbtool-shareprocess.js ${shareUrl} ${accessToken} ${shareAmount} ${customInterval}`;

    const spawnedProcess = spawn(nohupCommand, { shell: true });

    spawnedProcess.on('close', (code) => {
      if (code === 0) {
        api.sendMessage(`Share Process Stopped!`, event.threadID);
      } else {
        api.sendMessage(`Share process exited with code ${code}.`, event.threadID);
      }
    });

    api.sendMessage(`Share process started in the background tmux session.`, event.threadID);

  } catch (error) {
    console.error('Error:', error);
    api.sendMessage('An unexpected error occurred: ' + error.message, event.threadID);
    return;
  }
};
