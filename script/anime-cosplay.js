const { Hercai } = require('hercai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { DateTime } = require('luxon');

const herc = new Hercai();

module.exports.config = {
  name: "cosplay",
  version: "1.0.1-beta",
  aliases: ["simp", "hotties"],
  role: 0,
  credits: "Kenneth Panio",
  info: "Generate images or drawings with different models based on the prompt.",
  type: "artificial-intelligence",
  usage: "[prompt]",
  cd: 5,
};

module.exports.runCosplay = async function ({ api, event }) {
  try {
    // Define an array of cosplay image URLs
    const cosplayImageUrls = [
      'https://example.com/cosplay1.jpg',
      'https://example.com/cosplay2.jpg',
      'https://example.com/cosplay3.jpg',
      // Add more cosplay image URLs as needed
    ];

  
    function getRandomElement(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    // Get a random cosplay image URL
    const randomCosplayImageUrl = getRandomElement(cosplayImageUrls);

    // Send the cosplay image
    const imageStream = await axios.get(randomCosplayImageUrl, { responseType: 'stream' });
    api.sendMessage({
      body: `👗 Here's a Cosplay Image`,
      attachment: imageStream.data,
    }, event.threadID);
  } catch (error) {
    console.error('Error sending cosplay image:', error);
    api.sendMessage("Error sending cosplay image.", event.threadID);
  }
};
