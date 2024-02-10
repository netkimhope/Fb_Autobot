const axios = require('axios');

module.exports.config = {
  name: "tempmail",
  version: "1.0.0",
  role: 0,
  aliases: ['temp', 'genmail', 'dumpmail', 'mail', 'dump']
};

const TEMP_MAIL_URL = 'https://www.1secmail.com/api/v1/?action=genRandomMailbox';

module.exports.run = async ({ api, event, args }) => {
  try {
    if (args[0] === 'inbox') {
      const emailAddress = args[1];

      if (!emailAddress) {
        return api.sendMessage("Please provide an email address for the inbox.", event.threadID);
      }

      const [username, domain] = emailAddress.split('@');
      const inboxResponse = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${username}&domain=${domain}`);
      const messages = inboxResponse.data;

      if (!messages || messages.length === 0) {
        return api.sendMessage(`No messages found for ${emailAddress}.`, event.threadID);
      }

      const messageText = messages.map(message => `👤 𝗦𝗘𝗡𝗗𝗘𝗥: ${message.from}\n🎯 𝗦𝗨𝗕𝗝𝗘𝗖𝗧: ${message.subject || 'No Subject 🎯'}\n📨 𝗠𝗘𝗦𝗦𝗔𝗚𝗘: ${message.message}\n\n`).join('');
      
      api.sendMessage('Successful! please check pm or spam! in your message request.', event.threadID);
      api.sendMessage(`📬 | 𝗜𝗡𝗕𝗢𝗫\n\n${messageText}`, event.senderID);
    } else {
      const tempMailResponse = await axios.get(TEMP_MAIL_URL);
      const tempMailData = tempMailResponse.data;

      if (!tempMailData.email) {
        return api.sendMessage("Failed to generate temporary email.", event.threadID);
      }

      api.sendMessage(`${tempMailData}`, event.threadID);
    }
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage("No messages found in the current email, please use the command again", event.threadID);
  }
};
