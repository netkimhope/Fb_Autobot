const axios = require('axios');

module.exports.config = {
  name: "tempmail",
  version: "1.0.0",
  info: "generates random email from www.1secmail.com and fetches message from inbox",
  credits: "Kenneth Panio",
  type: "Accounting",
  role: 0,
  aliases: ['1secmail', 'temp', 'genmail', 'dumpmail', 'mail', 'dump'],
  usage: "[count (optional)] or inbox [email]"
};

const TEMP_MAIL_URL = 'https://www.1secmail.com/api/v1/?action=genRandomMailbox';
const MAX_EMAIL_COUNT = 10;

module.exports.run = async ({ api, event, args }) => {
  try {
    if (args[0] === 'inbox') {
      const [username, domain] = args[1].split('@');
      const messages = (await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${username}&domain=${domain}`)).data;
      const messageText = messages.map(message => `👤 𝗦𝗘𝗡𝗗𝗘𝗥: ${message.from}\n🎯 𝗦𝗨𝗕𝗝𝗘𝗖𝗧: ${message.subject || 'No Subject 🎯'}\n📨 𝗠𝗘𝗦𝗦𝗔𝗚𝗘: ${message.message}\n\n`).join('');
      api.sendMessage('Successful! Please check pm or spam in your message request.', event.threadID);
      api.sendMessage(messageText, event.senderID);
    } else {
      const count = Math.min(args[0] || 1, MAX_EMAIL_COUNT);
      if (count > MAX_EMAIL_COUNT) return api.sendMessage(`Maximum allowed count is ${MAX_EMAIL_COUNT}.`, event.threadID);
      const generatedEmails = (await axios.get(`${TEMP_MAIL_URL}&count=${count}`)).data.map(email => `Generated email: ${email}`).join('\n');
      api.sendMessage(generatedEmails, event.threadID);
    }
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage("Failed to generate or retrieve email, please try again.", event.threadID);
  }
};
