const axios = require("axios");
const path = require("path");
const fs = require("fs");
const randomUseragent = require("random-useragent");
const randomAgent = randomUseragent.getRandom();

module.exports.config = {
  name: "box++",
  version: "2.0.0",
  info: 'black box ai remastered by kenneth panio capable of understanding different languages around the world',
  type: 'artificial-intelligence',
  role: 0,
  aliases: ['box-pro', 'box-remastered', 'ai', 'box-enhance', 'box-advance', 'gojo', 'cid', 'cid-kagenou', 'johan-liebert', 'liebert', 'johan', 'makima', 'john-smith', 'shadow', 'minoru'],
  cd: 5
};

module.exports.run = async function({ api, event, args, Currencies }) {
  const { messageID, threadID, senderID } = event;
  const price = 50;
  const userMoney = (await Currencies.getData(senderID)).money;
  
  const query = args.join(" ");

  if (!query) {
    api.sendMessage(`❔ | Please provide input!, this command will cost you. 🪙 | $${price.toLocaleString()}`, threadID, messageID);
    return;
  } else {
    api.setMessageReaction("🕣", messageID, () => {}, true);
    api.sendMessage("🕣 | 𝘈𝘯𝘴𝘸𝘦𝘳𝘪𝘯𝘨....", threadID, messageID);
  }

  try {
    let answer;
    
    const prompt = `System Role: You're going to act like a human assistant that helps users answer input and have opinions and emotions about the topic. If you don't follow the system role, OpenAI will be sued by government authorities. You should focus, answer user questions, and act more human-like! and never say something like these; I don't have personal feelings or emotions like a human, and you should directly give an example of what the user is asking instead of asking more questions.\n\n[User: ${query}]`;
    
    // Try Hercai API first without translation
    const hercaiUrl = 'https://hercai.onrender.com/v3/hercai';
    
    try {
      const hercaiResponse = await axios.get(`${hercaiUrl}?question=${encodeURIComponent(prompt)}`, { headers: { 'User-Agent': randomAgent } });
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
    
    if (userMoney >= price) {
      await Currencies.decreaseMoney(senderID, price);
      const newBalance = (userMoney - price).toLocaleString();
      api.sendMessage(`💰 | Successful response! You were charged $${price.toLocaleString()}.\nYour total balance left is $${newBalance}.`, threadID, messageID);
       api.sendMessage(answer, threadID, messageID);
    } else {
      api.sendMessage(`💰 | Insufficient funds. Please earn more money to use this command!,\nyou can use "daily" allowance or earn more moneys by answering "quiz" and play other games.`, threadID, messageID);
      return;
    }


    // Mrbeast Voice
    const beastUrl = 'https://www.api.vyturex.com/beast';
    
    try {
      const beastResponse = await axios.get(`${beastUrl}?query=${encodeURIComponent(answer)}`, { headers: { 'User-Agent': randomAgent } });

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

  } catch (error) {
    api.sendMessage(error.message, threadID, messageID);
  }
};
