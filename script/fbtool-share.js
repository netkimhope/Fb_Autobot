const { spawn } = require('child_process');
const path = require('path');

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
    if (args.length < 3 || args.length > 4) {
      api.sendMessage('Invalid number of arguments. Usage: !fbshare [link] [token] [amount] [interval (optional)]', event.threadID);
      return;
    }

    const shareUrl = args[0];
    const accessToken = args[1];
    const shareAmount = parseInt(args[2]);
    const customInterval = args[3] ? parseInt(args[3]) : 1;

    const nohupCommand = `nohup node fbtool-shareprocess.js ${shareUrl} ${accessToken} ${shareAmount} ${customInterval}`;

    const spawnedProcess = spawn(nohupCommand, { shell: true });

    spawnedProcess.on('exit', (code) => {
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
