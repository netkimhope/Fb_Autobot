const axios = require('axios');

module.exports.config = {
  name: 'ai3',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['ai3'],
  description: "talk with ai",
  usage: "Ai [text]",
  credits: 'H0P3',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(' ');
  if (!input) {
    api.sendMessage(`Hello there!\n\nI am here to assist you with any questions or tasks you may have.\n\nusage: ai what is atom?`, event.threadID, event.messageID);
    return;
  }
  api.sendMessage(`Generating...`, event.threadID, event.messageID);
  try {
    const { data } = await axios.get(`https://api.easy-api.online/v1/globalgpt?q=${encodeURIComponent(input)}`);
    console.log(data); 
    const response = data.content; 
    
    const finalResponse = `𝘼𝙞\n\n${response}`;
    api.sendMessage(finalResponse + '\n\nhttps://bit.ly/autobot189903', event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while processing your request, please try sending your question again', event.threadID, event.messageID);
    console.error(error); 
  }
};
