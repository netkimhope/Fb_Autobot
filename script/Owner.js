const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
	name: 'owner',
	version: '1.0.0',
	hasPermssion: 0,
	credits: 'Rickciel',
	description: 'Display bot owner information',
	commandCategory: 'system',
	usages: '',
	cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
	try {
		const ownerInfo = {
			name: `${global.config.BOTOWNER}`,
			gender: 'MALE',
			age: '17',
			height: '5,4',
			facebookLink: `${global.config.OWNERLINK}`,
			status: 'SINGLE'
		};

		const videoUrl =  
'https://drive.google.com/uc?export=download&id=1CqgZ_LB4nLZRR8z2-lElfcQB9e3CdYz1'; // Replace with your Google Drive videoid link https://drive.google.com/uc?export=download&id=here put your video id

		const tmpFolderPath = path.join(__dirname, 'tmp');

		if (!fs.existsSync(tmpFolderPath)) {
			fs.mkdirSync(tmpFolderPath);
		}

		const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
		const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');

		fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

		const response = `
	《 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 》
\n➟${global.config.BOTOWNER} Senpai\n
❂ Admin UID: ${global.config.OWNERID}\n
♛ Admin FB Link:\n${global.config.OWNERLINK}
`;


		await api.sendMessage({
			body: response,
			attachment: fs.createReadStream(videoPath)
		}, event.threadID, event.messageID);

		if (event.body.toLowerCase().includes('ownerinfo')) {
			api.setMessageReaction('🥵', event.messageID, (err) => {}, true);
		}
	} catch (error) {
		console.error('Error in ownerinfo command:', error);
		return api.sendMessage('An error occurred while processing the command.', event.threadID);
	}
};