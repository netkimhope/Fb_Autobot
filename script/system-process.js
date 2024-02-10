module.exports.config = {
	name: "reactivate",
	type: "utility",
	version: "7.0.0",
	role: 3,
	aliases: ['restart', 'reboot', 'resetbot'],
	dependencies: {
		"process": ""
	}
};
module.exports.run = async function({ api, event, args }) {
  const process = require("process");
  const { threadID, messageID } = event;
  api.sendMessage(`𝗦𝗬𝗦𝗧𝗘𝗠 𝗥𝗘𝗕𝗢𝗢𝗧𝗜𝗡𝗚...`, threadID, ()=> process.exit(1));
}
