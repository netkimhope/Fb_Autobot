const axios = require('axios');

module.exports.config = {
  name: 'rizz-bot',
  version: '1.0 alpha',
};

module.exports.handleEvent = async function ({ api, event }) {
  const { messageID, threadID, senderID } = event;
  let userName = await getUserName(api, senderID);

  const triggerWords = ['love', 'awesome', 'cool', 'amazing', 'astig', 'angas', 'galing', 'labyo', 'mahal', 'ambot', 'yawa', 'boang', 'baliw', 'tangina', 'panio', 'kenneth', 'trip', 'rizz', 'tease', 'cute', 'ganda', 'bby', 'baby', 'haha']; // Add more trigger words as needed
  
  const lowercasedBody = event.body ? event.body.toLowerCase() : '';

  for (const word of triggerWords) {
    if (lowercasedBody.toLowerCase().includes(word)) {
      try {
        const response = await axios.get('https://reiko-api.vercel.app/api/random-rizz');
        const rizz = response.data.pickup;

        api.sendMessage(`${userName}, ${rizz}`, threadID, messageID);
      } catch (error) {
        console.error('Error fetching random rizz:', error);
        api.sendMessage('Sorry, there was an error fetching the random rizz.', threadID, messageID);
      }

    }
  }
};

async function getUserName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);
    if (userInfo && userInfo[userID]) {
      return userInfo[userID].name;
    } else {
      return "unknown";
    }
  } catch (error) {
    return "unknown";
  }
};
