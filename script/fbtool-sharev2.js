const { spawn } = require('child_process');
const path = require('path');

module.exports.config = {
  name: "fbsharev2",
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

    const shareProcessPath = path.join(__dirname, 'fbtool-shareprocess.js');

    const nohupCommand = `nohup node ${shareProcessPath} ${shareUrl} ${accessToken} ${shareAmount} ${customInterval} > /dev/null 2>&1 &`;

    const spawnedProcess = spawn(nohupCommand, { shell: true });

    spawnedProcess.on('exit', (code) => {
      if (code === 0) {
        api.sendMessage(`Share process stopped successfully.`, event.threadID);
      } else {
        api.sendMessage(`Share process exited with code ${code}.`, event.threadID);
      }
    });

    api.sendMessage(`Share process started in the background.`, event.threadID);
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage('An unexpected error occurred: ' + error.message, event.threadID);
    return;
  }
};
