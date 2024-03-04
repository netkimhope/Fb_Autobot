const axios = require('axios');

module.exports.config = {
  name: 'bot-reaction',
  version: '1.0.2',
};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.body !== null) {
          api.markAsReadAll(() => { });
        }
  const { messageID, threadID, senderID } = event;
  let userName = await getUserName(api, senderID);
  const aniCategory = ['waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile', 'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp', 'slap', 'kill', 'kick', 'happy', 'wink', 'poke', 'dance', 'cringe'];
  
  const duckTrig = ['duck', 'quack', 'quak', 'etik', 'bby', 'bebe'];
  
  const rizzTrig = ['love', 'awesome', 'cool', 'amazing', 'astig', 'angas', 'galing', 'labyo', 'mahal', 'ambot', 'yawa', 'boang', 'baliw', 'tangina', 'panio', 'kenneth', 'trip', 'rizz', 'tease', 'cute', 'ganda', 'bby', 'baby', 'haha'];
  
  const body = event.body ? event.body.toLowerCase() : '';

  const matchedCategory = aniCategory.find(aniCat => body.includes(aniCat));

  if (matchedCategory) {
    try {
      const response = await axios.get(`https://api.waifu.pics/sfw/${matchedCategory}`);
      const imageUrl = response.data.url;
      const options = { responseType: 'stream' };
      const imageResponse = await axios.get(imageUrl, options);
      const attachment = { attachment: imageResponse.data };

      // Send the waifu picture as a reaction
      api.sendMessage(attachment, threadID);
    } catch (error) {
      console.error('Error fetching waifu picture:', error);
    }
  }
  for (const word of duckTrig) {
    if (body.toLowerCase().includes(word)) {
      try {
        const response = await axios.get(`https://random-d.uk/api/v2/random`);
        const imageUrl = response.data.url;
        const options = { responseType: 'stream' };
        const imageResponse = await axios.get(imageUrl, options);
        const attachment = { attachment: imageResponse.data };
  
        api.sendMessage(attachment, threadID);
  
      } catch (error) {
        console.error('Error fetching duck picture:', error);
      }
  
    }
  }

  for (const word of rizzTrig) {
    if (body.toLowerCase().includes(word)) {
      try {
        const response = await axios.get('https://reiko-api.vercel.app/api/random-rizz');
        const rizz = response.data.pickup;

        api.sendMessage(`${userName}, ${rizz}`, threadID, messageID);
      } catch (error) {
        console.error('Error fetching random rizz:', error);
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
