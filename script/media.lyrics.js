const axios = require('axios');

module.exports.config = {
  name: 'lyrics',
  version: '0.0.1 beta',
  hasPermssion: 0,
  credits: 'kennethpanio',
  usePrefix: false,
  description: 'This cmd function is automated post',
  commandCategory: 'MEDIA',
  usages: '[title]',
  cooldowns: 0,
};

module.exports.run = async function ({ args, api, event }) {
  const { threadID, messageID } = event;
  const query = args.join(' ');

  if (!query) { 
    api.sendMessage('Please provide a title of lyrics', threadID, messageID);
    return;
  }

  try { 
    const response = await axios.get(`https://lyrist.vercel.app/api/${encodeURIComponent(query)}`);

    if (response.data) {
      const lyrics = response.data.lyrics;
      const title = response.data.title;
      const artist = response.data.artist;

      if (lyrics) {
        l
      } else {
        api.sendMessage('🚫 No lyrics found for the given song title.', threadID, messageID);
      }
    } else {
      api.sendMessage('🚫 No data found for the given song title.', threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while fetching lyrics!', threadID, messageID);
  }
};






