module.exports.config = {
	name: "reboot",
	type: "utility",
	version: "7.0.0",
	role: 3,
	aliases: ['restart', 'resetbot'],
	dependencies: {
		"process": ""
	}
};
module.exports.run = async function({ api, event, args }) {
  const pogi = "100086928967994";
   if (!pogi.includes(event.senderID))
   return api.sendMessage("This command is only for AUTOBOT owner.", event.threadID, event.messageID);
  const process = require("process");
  const { threadID, messageID } = event;
  api.sendMessage(`restarting bot....`, threadID, ()=> process.exit(1));
}
