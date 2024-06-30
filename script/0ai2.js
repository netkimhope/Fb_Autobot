const axios = require('axios');

module.exports.config = {
	name: "aiv2",
	version: "1.0.0",
	role: 0,
	credits: "Jonell Magallanes",
	description: "cmd ai ",
	hasPrefix: true,
	usage:"aiv2 [your content]",
	cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {

	const content = encodeURIComponent(args.join(" "));

	if (!content) {
		return api.sendMessage("Please Provide your question with ai", event.threadID, event.messageID);
	}
 api.setMessageReaction("⏳", event.messageID, (err) => {
  }, true);
api.sendTypingIndicator(event.threadID, true);
	api.sendMessage("Searching please wait...", event.threadID, event.messageID); 

	const apiUrl = `https://bluerepoapislasttry.onrender.com/hercai?content=${content}`;

	try {
		const response = await axios.get(apiUrl);
		const reply = response.data.reply;

		api.sendMessage(reply, event.threadID, event.messageID);
	} catch (error) {
		console.error("Error fetching data:", error.message);
		api.sendMessage("An error occurred while processing your request.", event.threadID);
	}
};
