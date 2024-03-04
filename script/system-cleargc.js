module.exports.config = {
  name: "cleargc",
  aliases: ['cleangc'],
  version: "0.1.5",
  role: 1,
  credits: "kennethpanio",
  info: "Remove Everyone in Group Automatically",
  type: "moderation",
  cd: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const botID = api.getCurrentUserID();
  var threadInfo = await api.getThreadInfo(event.threadID);
  let adminIDs = threadInfo.adminIDs.map(admin => admin.id);
  var id = threadInfo.participantIDs;

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Check if the bot is an admin
  if (!adminIDs.includes(botID)) {
    console.log("Bot is not an admin. Skipping removal logic.");
    api.sendMessage(`I'm not an admin, so I can't kick everyone! You need to turn me into admin of the group first.`, event.threadID);
    return;
  }

  api.sendMessage("Kicking all group members excluding Admins and Bot itself....", event.threadID);

  for (let participantID of id) {
    // Skip if the participant is the bot or an admin
    if (participantID === botID || adminIDs.includes(participantID)) {
      continue;
    }

    await delay(5000);
    api.removeUserFromGroup(participantID, event.threadID);
  }
};
