const axios = require("axios");
const path = require("path");
const fs = require("fs");

module.exports.config = {
  name: "box++",
  version: "2.0.0",
  info: 'black box ai remastered by kenneth panio capable of understanding different languages around the world',
  type: 'artificial-intelligence',
  role: 0,
  aliases: ['box-pro', 'box-remastered', 'ai', 'box-enhance', 'box-advance', 'gemini', 'gojo', 'cid', 'cid-kagenou', 'johan-liebert', 'liebert', 'johan', 'makima', 'john-smith', 'shadow', 'minoru'],
  cd: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { messageID, threadID } = event;
  const query = args.join(" ");

  if (!query) {
    api.sendMessage("❔ | Please Provide Input...", threadID, messageID);
    return;
  }

  try {
    api.setMessageReaction("🕣", messageID, () => {}, true);
    api.sendMessage("🕣 | 𝘈𝘯𝘴𝘸𝘦𝘳𝘪𝘯𝘨....", threadID, messageID).then(() => {
      let answer;

      // Try Hercai API first without translation
      const hercaiUrl = 'https://hercai.onrender.com/v3/hercai';
      try {
        const hercaiResponse = await axios.get(`${hercaiUrl}?question=${encodeURIComponent(query)}`);
        answer = hercaiResponse.data.reply || 'No Answers Found';
      } catch (hercaiError) {
        console.error('Error during Hercai API request:', hercaiError);

        // If Hercai fails, use black box with translation
        try {
          const translationUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(query)}`;
          const translationResponse = await axios.get(translationUrl);
          const translatedQuery = translationResponse.data[0][0][0];

          const boxUrl = 'https://useblackbox.io/chat-request-v4';
          const boxData = {
            textInput: translatedQuery,
            allMessages: [{ user: translatedQuery }],
            stream: '',
            clickedContinue: false,
          };

          const boxResponse = await axios.post(boxUrl, boxData);
          answer = boxResponse.data.response[0][0] || 'No Answers Found';
        } catch (boxError) {
          console.error('Error during Black Box API request:', boxError);
          answer = 'No Answers Found';
        }
      }

      // Send the response
      const formattedResponse = `${answer}`;
      api.sendMessage(formattedResponse, threadID, messageID);

      // Mrbeast Voice
      const beastUrl = 'https://www.api.vyturex.com/beast';
      try {
        const beastResponse = await axios.get(`${beastUrl}?query=${encodeURIComponent(answer)}`);
        if (beastResponse.data && beastResponse.data.audio) {
          const audioURL = beastResponse.data.audio;
          const fileName = "mrbeast_voice.mp3"; 
          const filePath = path.resolve(__dirname, 'cache', fileName);

          const { data: audioData } = await axios.get(audioURL, { responseType: 'arraybuffer' });
          fs.writeFileSync(filePath, audioData);

          api.sendMessage({
            body: "💽 𝗩𝗼𝗶𝗰𝗲",
            attachment: fs.createReadStream(filePath)
          }, threadID, async (voiceError) => {
            if (voiceError) {
              console.error('Error sending voice response:', voiceError);
            }

            fs.unlinkSync(filePath); // Remove the temporary voice file
          });
        } else {
          console.error("Failed to fetch Beast API response.");
        }
      } catch (beastError) {
        console.error('Error during Beast API request:', beastError);
      }
    });

  } catch (error) {
    api.sendMessage(error.message, threadID, messageID);
  }
};
