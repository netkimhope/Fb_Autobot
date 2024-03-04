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
  const process = require("process");
  const { threadID, messageID } = event;
  api.sendMessage(`restarting bot....`, threadID, ()=> process.exit(1));
}
