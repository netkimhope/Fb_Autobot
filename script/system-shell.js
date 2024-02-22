module.exports.config = {
  name: "shell",
  version: "7.3.1",
  role: 3,
  aliases: ["linux", "ubuntu", "termux", "terminal", "command-prompt", "power-shell"]
};

module.exports.run = async function({ api, event, args }) {
  const { exec } = require("child_process");
  const text = args.join(" ");

  if (!text) {
    api.sendMessage("❔ | Please provide a command to execute.", event.threadID, event.messageID);
    return;
  }

  exec(`${text}`, (error, stdout, stderr) => {
    if (error) {
      api.sendMessage(`error: \n${error.message}`, event.threadID, event.messageID);
      return;
    }
    if (stderr) {
      api.sendMessage(`stderr:\n ${stderr}\n${stdout}`, event.threadID, event.messageID);
      return;
    }
    api.sendMessage(`stdout:\n ${stdout}`, event.threadID, event.messageID);
  });
};
