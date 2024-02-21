const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports.config = {
  name: "pastebin-alert",
  version: "69",
  credits: "liane"
}

const downloadDirectory = path.resolve(__dirname, 'cache');

var owner = '61550873742628';
module.exports.handleEvent = async function ({ api, event }) {
  
  let text = event.body;
  let regex = /https:\/\/pastebin\.com\/raw\/\S+$/g;
        
  
  if (event.body !== null) {
          const pastebinLinkRegex = /https:\/\/pastebin\.com\/raw\/[\w+]/;
          if (pastebinLinkRegex.test(event.body)) {
            api.getThreadInfo(event.threadID, (err, info) => {
              if (err) {
                console.error('Failed to get thread info:', err);
                return;
              }
              const threadName = info.threadName;
              api.sendMessage({
                body: `📜 | 𝗣𝗔𝗦𝗧𝗘𝗕𝗜𝗡 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗 𝗢𝗡\n\n𝖳𝗁𝗋𝖾𝖺𝖽: ${threadName}\nUser: ${event.senderID}\n\n𝖫𝗂𝗇𝗄:\n\n${event.body}`,
                url: event.body
              }, owner);
            });
          }
        }
        
        if (regex.test(text)) {
          var link = 'https://i.postimg.cc/3RLHGcJp/New-Project-1212-79-D6215.png';
          var callback = () => pushMessage.reply({ body: `Pastebin link detected! some user send the link of pastebin of this group`, attachment: fs.createReadStream(__dirname + "/cache/alert.jpg") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/alert.jpg", event.messageID));
          return request(link).pipe(fs.createWriteStream(__dirname + "/cache/alert.jpg")).on("close", () => callback());
        }
          
        
          if (regex.test(text)) {
            let imageUrl = 'https://i.postimg.cc/7LytZnDk/Screenshot-2023-11-01-23-32-56-32.jpg';
            let responseText = 'Pastebin Alert!';
            try {
              let response = await axios.get(text);
        
              if (response.status == 200) {
                var link = imageUrl;
                var callback = () => api.sendMessage({ body: responseText, attachment: fs.createReadStream(downloadDirectory + "/alert.jpg") }, event.threadID, () => fs.unlinkSync(downloadDirectory + "/alert.jpg", event.messageID + owner));
                return request(link).pipe(fs.createWriteStream(downloadDirectory + "/alert.jpg")).on("close", () => callback());
              } else {
                return api.sendMessage('Invalid Pastebin URL', event.threadID, event.messageID);
              }
            } catch (err) {
              return api.sendMessage('Something went wrong', event.threadID, event.messageID);
            }
          }
        
}