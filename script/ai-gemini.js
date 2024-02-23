const axios = require("axios");
const gtts = require("gtts");
const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");

module.exports.config = {
  name: "gemini",
  version: "2.0.1",
  role: 0,
  credits: "Reiko Dev",
  info: "talk to ai powered by google",
  type: "artificial-intelligence",
  usage: "[prompt]",
  aliases: ["bard", "geminipro", "gemini-pro", "brad", "nlp", "gm", "gmp", "bard-gemini", "geminibard", "gemini-bard", "bardgemini"],
  cd: 5,
};

module.exports.run = async function ({ api, event, args, Currencies }) {
  try {
    const { threadID, messageID, senderID } = event;
    const price = 1000;
    const userMoney = (await Currencies.getData(senderID)).money;
    
    const estorya = args.join(" ");

    if (!estorya) {
      api.sendMessage(`❔ | Please provide input!, this command will cost you. 💰 | $${price.toLocaleString()}`, threadID, messageID);
      return;
    } else {
      api.sendMessage("🕣 | 𝘈𝘯𝘴𝘸𝘦𝘳𝘪𝘯𝘨....", threadID, messageID);
    }

    try {
      const userName = await getUserName(api, senderID);
      const response = await axios.get(`https://project-gemini-daac55836bf7.herokuapp.com/api/gemini?query=${encodeURIComponent(estorya)}&uid=${senderID}&cookie=g.a000gggofsT-eH4KIvq359t2PSkOCpfqw50IE922AbLD-vn8M1oZ5clc36fJT8D_mWe8eXtQEwACgYKAZgSAQASFQHGX2Mix0E7IgxI48h5sQo6YgKwjBoVAUF8yKpG8zgsWay_nGUmv-fyG61J0076`);
      const text = response.data.message || "I can't answer that!";

      function fontText(text) {
        const fontSet = {
          "A": "𝗔", "B": "𝗕", "C": "𝗖", "D": "𝗗", "E": "𝗘",
          "F": "𝗙", "G": "𝗚", "H": "𝗛", "I": "𝗜", "J": "𝗝",
          "K": "𝗞", "L": "𝗟", "M": "𝗠", "N": "𝗡", "O": "𝗢",
          "P": "𝗣", "Q": "𝗤", "R": "𝗥", "S": "𝗦", "T": "𝗧",
          "U": "𝗨", "V": "𝗩", "W": "𝗪", "X": "𝗫", "Y": "𝗬",
          "Z": "𝗭", "a": "𝗔", "b": "𝗕", "c": "𝗖", "d": "𝗗",
          "e": "𝗘", "f": "𝗙", "g": "𝗚", "h": "𝗛", "i": "𝗜",
          "j": "𝗝", "k": "𝗞", "l": "𝗟", "m": "𝗠", "n": "𝗡",
          "o": "𝗢", "p": "𝗣", "q": "𝗤", "r": "𝗥", "s": "𝗦",
          "t": "𝗧", "u": "𝗨", "v": "𝗩", "w": "𝗪", "x": "𝗫",
          "y": "𝗬", "z": "𝗭",
        };

        let result = "";
        for (let i = 0; i < text.length; i++) {
          const textLength = text[i];
          const font = fontSet[textLength];
          result += font !== undefined ? font : textLength;
        }

        return result;
      }   
      
      const regex = /(\#\#(.+?)\:)|(\*\*(.+?)\*\*)/g;
      const result = text.replace(regex, (match, p1, p2, p3, p4) => {
        const trimmedText = p2 || p4 || "";
        return fontText(trimmedText);
      });

      const manilaTime = DateTime.now().setZone("Asia/Manila").toFormat("yyyy-MM-dd hh:mm:ss a");
      const sure= result;

      if (sure && sure.length > 0) {
        const imageUrls = response.data.imageUrls || [];
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
        
        if (userMoney >= price) {
          await Currencies.decreaseMoney(senderID, price);
          const newBalance = (userMoney - price).toLocaleString();

          api.sendMessage(`💰 | Successful response! You were charged $${price.toLocaleString()}.\nYour total balance left is $${newBalance}.`, threadID, messageID);
        } else {
          api.sendMessage(`💰 | Insufficient funds. Please earn more money to use this command!\nYou can use "daily" allowance or earn credits by answering "quiz" and playing other games.`, threadID, messageID);
          return;
        }

        api.sendMessage(sure, threadID, messageID);
        api.sendMessage({attachment: Pictures},threadID, messageID);
        const gttsInstance = new gtts(result, 'en-us');
        const gttsPath = path.join(__dirname, 'voicebox.mp3');
        gttsInstance.save(gttsPath, function (error) {
          if (error) {
            console.error("Error saving gTTS:", error);
          } else {
            api.sendMessage({
              body: "💽 𝗩𝗼𝗶𝗰𝗲 𝗕𝗼𝘅 𝗔𝗜",
              attachment: fs.createReadStream(gttsPath)
            }, threadID);
          }
        });
      }
    } catch (error) {
      api.sendMessage(error.message, threadID, messageID);
    }
  } catch (error) {
    console.error("Top-level error:", error);
  }
}

async function getUserName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);
    return userInfo && userInfo[userID] ? userInfo[userID].name : "unknown";
  } catch (error) {
    return "unknown";
  }
}
