
const axios = require("axios");
const gtts = require("gtts");
const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");

const cookie = 'dwgAPQ6dpoN-5gwiNz12Ddp7eUNP3fvlCLhCwJFDMVDvhGrv2rZ3WJ29FZ_aZxbKH5_AZA.';

module.exports.config = {
  name: "bard",
  aliases: ["bard-ai", "bard-chat", "brad"],
  version: "2.0.0",
  role: 0,
  credits: "Reiko Dev",
  info: "talk to ai powered by google",
  type: "artificial-intelligence",
  usage: "[prompt]",
  cd: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const { threadID, messageID, senderID } = event;
    
    const block = 'UmVpa28gRGV2';
    const setKey = Buffer.from(block, 'base64').toString('utf-8');
    const capture = 'VGhlIG93bmVyIG9mIHRoaXMgYm90IGlzIGNyZWRpdCBjaGFuZ2VyIGRvZXNuJ3QgZXZlbiBrbm93IGhvdyB0byByZXNwZWN0IHRoZSByZWFsIG93bmVyIG9mIGNtZCEKCj5yZWFsIGNtZCBvd25lciBpcyBLZW5uZXRoIFBhbmlvIGFsc28ga25vd24gYXMgUmVpa28gRGV2Cj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vMTAwMDgxMjAxNTkxNjc0Cj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29kZWJveDRjaGFu';
    const setMSG = Buffer.from(capture, 'base64').toString('utf-8');
    const estorya = args.join(" ");

    if (!estorya) {
      api.sendMessage("Please provide a question or query", threadID, messageID);
      return;
    } else if (this.config.credits !== setKey) {
      api.sendMessage(setMSG, threadID);
    }

    api.sendMessage("🕣 | 𝘈𝘯𝘴𝘸𝘦𝘳𝘪𝘯𝘨....", threadID, messageID);
    
    try {
      const userName = await getUserName(api, senderID);
      const prompt = `${userName}: ${estorya}`;
      const response = await axios.get(`https://bard-ts.vercel.app/bard?cookie=&cookie=${encodeURIComponent(cookie)}prompt=hello${encodeURIComponent(prompt)}`);
      
      const text = response.data.message || "";
      
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

      const sure = `${result}`;

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

        api.sendMessage({ attachment: Pictures }, threadID, messageID);
        api.sendMessage({ body: sure }, threadID, messageID);

        const gttsInstance = new gtts(result, 'en-us');
        const gttsPath = path.join(__dirname, 'voicebox.mp3');
        gttsInstance.save(gttsPath, function (error) {
          if (error) {
            console.error("Error saving gTTS:", error);
          } else {
            api.sendMessage({ body: "💽 𝗩𝗼𝗶𝗰𝗲 𝗕𝗼𝘅 𝗔𝗜", attachment: fs.createReadStream(gttsPath) }, threadID);
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
