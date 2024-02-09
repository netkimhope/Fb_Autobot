const axios = require('axios');

module.exports.config = {
  name: "tempmail",
  version: "1.0.0",
  role: 0,
  aliases: ['temp', 'genmail', 'dumpmail', 'mail', 'dump']
};

const TEMP_MAIL_URL = 'https://kazumaoff-peachwings.replit.app/api/gen';

module.exports.run = async ({ api, event, args }) => {
  try {
    if (args[0] === 'inbox') {
      if (!args[1]) {
        return api.sendMessage("Please provide an email address for the inbox.", event.threadID);
      }
      
      const emailAddress = args[1];
      const inboxResponse = await axios.get(`https://scp-09.onrender.com/api/getmessage/${emailAddress}`);
      const messages = inboxResponse.data.messages;

      if (!messages || messages.length === 0) {
        return api.sendMessage(`No messages found for ${emailAddress}.`, event.threadID);
      }

      let messageText = '📬 | 𝗜𝗡𝗕𝗢𝗫\n\n';
      for (const message of messages) {
        messageText += `👤 𝗦𝗘𝗡𝗗𝗘𝗥: ${message.sender}\n`;
        messageText += `🎯 𝗦𝗨𝗕𝗝𝗘𝗖𝗧: ${message.subject || 'No Subject 🎯'}\n`;

        // Use regex to remove HTML structure from the message
        const plainTextMessage = message.message.replace(/<[^>]*>/g, '').trim();
        messageText += `📨 𝗠𝗘𝗦𝗦𝗔𝗚𝗘: ${plainTextMessage}\n\n`;
      }
      api.sendMessage('Successful! please check pm or spam! in your message request.', event.threadID);
      api.sendMessage(messageText, event.senderID);
    } else {
      const tempMailResponse = await axios.get(TEMP_MAIL_URL);
      const tempMailData = tempMailResponse.data;

      if (!tempMailData.email) {
        return api.sendMessage("Failed to generate temporary email.", event.threadID);
      }

      api.sendMessage(`${tempMailData.email}`, event.threadID);
    }
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage("No messages found in the current email, please use the command again", event.threadID);
  }
};
