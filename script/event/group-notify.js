const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
  name: "group-notify",
  version: "69",
  credits: "hutchin" //optimized by kenneth panio
}

const downloadDirectory = path.resolve(__dirname, 'cache');

module.exports.handleEvent = async function ({ api, event }) {
if (event.body !== null) {
          // Check if the message type is log:subscribe
          if (event.logMessageType === "log:subscribe") {
            const { threadID } = event;

            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
              api.changeNickname(`Pogi si Kenneth`, threadID, api.getCurrentUserID());
            return api.sendMessage(`✅ | BOT HAS BEEN CONNECTED FROM THIS THREAD\n\n👷 Developer: Kenneth Panio`, threadID);
            } else {
              try {
                const fs = require("fs-extra");
                let { threadName, participantIDs } = await api.getThreadInfo(threadID);

                var mentions = [], nameArray = [], memLength = [], i = 0;

                let addedParticipants1 = event.logMessageData.addedParticipants;
                for (let newParticipant of addedParticipants1) {
                  let userID = newParticipant.userFbId;
                  api.getUserInfo(parseInt(userID), (err, data) => {
                    if (err) { return console.log(err); }
                    var obj = Object.keys(data);
                    var userName = data[obj].name.replace("@", "");
                    if (userID !== api.getCurrentUserID()) {

                      nameArray.push(userName);
                      mentions.push({ tag: userName, id: userID, fromIndex: 0 });

                      memLength.push(participantIDs.length - i++);
                      memLength.sort((a, b) => a - b);

                      (typeof threadID.customJoin == "undefined") ? msg = "BONJOUR!, {uName}\n┌────── ～●～ ──────┐\n----- Welcome to {threadName} -----\n└────── ～●～ ──────┘\nYou're the {soThanhVien} member of this group, please enjoy! 🥳♥" : msg = threadID.customJoin;
                      msg = msg
                        .replace(/\{uName}/g, nameArray.join(', '))
                        .replace(/\{type}/g, (memLength.length > 1) ? 'you' : 'Friend')
                        .replace(/\{soThanhVien}/g, memLength.join(', '))
                        .replace(/\{threadName}/g, threadName);


                      let callback = function() {
                        return api.sendMessage({ body: msg, attachment: fs.createReadStream(__dirname + `/cache/come.jpg`), mentions }, event.threadID, () => fs.unlinkSync(downloadDirectory + `/cache/come.jpg`))
                      };
                      request(encodeURI(`https://api.popcat.xyz/welcomecard?background=https://i.ibb.co/P6k0Q4B/images-2023-12-05-T213426-636.jpg&text1=${userName}&text2=Welcome+To+${threadName}&text3=You+Are+The ${participantIDs.length}th+Member&avatar=https://i.postimg.cc/7ZxG6XrH/images-2023-12-14-T220221-504.jpg`)).pipe(fs.createWriteStream(downloadDirectory + `/cache/come.jpg`)).on("close", callback);
                    }
                  })
                }
              } catch (err) {
                return console.log("ERROR: " + err);
              }
            }
          }
        }
        if (event.body !== null) {
          if (event.logMessageType === "log:unsubscribe") {
            api.getThreadInfo(event.threadID).then(({ participantIDs }) => {
              let leaverID = event.logMessageData.leftParticipantFbId;
              api.getUserInfo(leaverID, (err, userInfo) => {
                if (err) {
                  return console.error('Failed to get user info:', err);
                }
                const name = userInfo[leaverID].name;
                const type = (event.author == event.logMessageData.leftParticipantFbId) ? "left the group." : "kicked by Admin of the group"; api.sendMessage(`${name} has ${type} the group.`, event.threadID);
              });
            })
          }
        }
};