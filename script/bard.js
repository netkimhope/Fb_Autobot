const axios = require("axios");
const { RsnChat } = require("rsnchat");
const fs = require("fs");
const path = require("path");

const rsnchat = new RsnChat("rsnai_tAB13b9bfq4Jr9kj4Y48qJtE");

module.exports.config = {
  name: "bard",
  credits: 'Kenneth Panio',
  version: "2.0.0",
  info: 'bard ai provider',
  type: 'artificial-intelligence',
  usage: "[prompt]",
  role: 0,
};

module.exports.run = async ({ api, event, args, chat }) => {
  const { senderID } = event;
  const query = args.join(" ");

  if (!query) {
    chat.react("⁉️");
    chat.reply(`Please provide input!`);
    return;
  } else {
    chat.react("🕣");
    chat.reply("🕣 | Answering....");
  }

  try {
    rsnchat.bard(query).then(async (response) => {
      const answer = response.message;
      const line = '━'.repeat(18);

      console.log(answer);

      chat.react("❤️");
      chat.reply(`🗣️𝐁𝐀𝐑𝐃 𝐀𝐈\n${line}\n${answer}\n${line}\n-Free`);

      const imageUrlRegex = /!\[.*?\]\((.*?)\)/g;
      let imageUrlMatches;
      const imageUrls = [];
      while ((imageUrlMatches = imageUrlRegex.exec(answer)) !== null) {
        imageUrls.push(imageUrlMatches[1]);
      }

      const Pictures = [];
      if (!fs.existsSync("cache")) {
        fs.mkdirSync("cache");
      }

      for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        const photoPath = `cache/photo_${i + 1}.png`;
        try {
          const imageResponse = await axios.get(url, { responseType: "arraybuffer" });
          fs.writeFileSync(photoPath, imageResponse.data);
          Pictures.push(fs.createReadStream(photoPath));
        } catch (error) {
          console.error("Error occurred while downloading and saving the photo:", error);
        }
      }

      if (Pictures.length > 0) {
        chat.reply({ attachment: Pictures });
      }

      const beastUrl = 'https://www.api.vyturex.com/beast';
      try {
        axios.get(`${beastUrl}?query=${encodeURIComponent(answer)}`).then(async (beastResponse) => {
          if (beastResponse.data && beastResponse.data.audio) {
            const audioURL = beastResponse.data.audio;
            const fileName = "voice_message.mp3";
            const filePath = path.resolve(__dirname, 'cache', fileName);

            try {
              const audioDataResponse = await axios.get(audioURL, { responseType: 'arraybuffer' });
              fs.writeFileSync(filePath, audioDataResponse.data);

              chat.reply({
                body: "💽 Voice Message",
                attachment: fs.createReadStream(filePath)
              });
            } catch (audioError) {
              console.error("Error while fetching audio:", audioError);
            }
          } else {
            console.error("Failed to fetch Beast API response.");
          }
        }).catch((beastError) => {
          console.error('Error during Beast API request:', beastError);
        });
      } catch (error) {
        console.error("Error during Beast API request:", error);
      }
    }).catch((error) => {
      chat.react("💔");
      chat.reply(error.message);
    });
  } catch (error) {
    chat.react("💔");
    chat.reply(error.message);
  }
};