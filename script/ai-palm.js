          const axios = require('axios');
          const fs = require('fs');
          const path = require('path');
          const { DateTime } = require('luxon');

          module.exports.config = {
            name: 'palm',
            aliases: ['coconut', 'lamda', 'palm-2', 'palm2'],
            version: '4.0.0',
            role: 0,
            credits: 'reiko dev',
            info: 'Talk to Palm AI',
            type: 'artificial-intelligence',
            usage: '[ask]',
            cd: 4,
          };

          module.exports.run = async ({ api, event, args }) => {
            const { threadID, messageID, senderID } = event;
            if (args.length < 1) {
              return api.sendMessage('Please provide a question.', threadID, messageID);
            } else {
                api.setMessageReaction("🕣", messageID, () => {}, true);
                api.sendMessage("🕣 | 𝘈𝘯𝘴𝘸𝘦𝘳𝘪𝘯𝘨....", threadID, messageID);
              }

            const input = args.join(' ');
            const manilaTime = DateTime.now().setZone('Asia/Manila').toFormat('yyyy-MM-dd hh:mm:ss a');

            let userName = await getUserName(api, senderID);
      
            const response = await axios.get(`https://reiko-api.vercel.app/api/palm?prompt=${encodeURIComponent(input)}&apiKey=codebox4chan`);
            const sagot = response.data.reply || `i can't answer that!`;

            api.sendMessage(sagot, threadID);

            // MrBeast API for voice
            const beastUrl = 'https://www.api.vyturex.com/beast';
            try {
              const beastResponse = await axios.get(`${beastUrl}?query=${encodeURIComponent(sagot)}`);
              if (beastResponse.data && beastResponse.data.audio) {
                const audioURL = beastResponse.data.audio;
                const fileName = "mrbeast_voice.mp3";
                const filePath = path.resolve(__dirname, 'cache', fileName);

                const { data: audioData } = await axios.get(audioURL, { responseType: 'arraybuffer' });
                fs.writeFileSync(filePath, audioData);

                api.sendMessage({
                  body: '💽𝗩𝗼𝗶𝗰𝗲 𝗕𝗼𝘅',
                  attachment: fs.createReadStream(filePath),
                }, threadID, async (voiceError) => {
                  if (voiceError) {
                    console.error('Error sending voice response:', voiceError);
                  }

                  fs.unlinkSync(filePath); 
                });
              } else {
                console.error("Failed to fetch Beast API response.");
              }
            } catch (beastError) {
              console.error('Error during Beast API request:', beastError);
            }
          };

          async function getUserName(api, userID) {
            try {
              const userInfo = await api.getUserInfo(userID);
              return userInfo && userInfo[userID] ? userInfo[userID].name : "unknown";
            } catch (error) {
              console.error('Error getting user name:', error);
              return "unknown";
            }
          }