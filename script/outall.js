module.exports.config = {
  name: "outall",
  version: "1.0.0",
  role: 2,
  credits: "HungCho",
  description: "out of whole group",
  usages: "{p}outall",
  hasPrefix: false,
  cooldown: 5
};

module.exports.run = async ({ api, event, args }) => {
    const pogi = "100086928967994";
   if (!pogi.includes(event.senderID))
   return api.sendMessage("Sorry baby! si Jun lang po pwede pag pinilit mo masasaktan ka lang sa huli mwaa.", event.threadID, event.messageID);
  try {
    const list = await api.getThreadList(100, null, ["INBOX"]);
    list.forEach(async (item) => {
      if (item.isGroup && item.threadID !== event.threadID) {
        await api.removeUserFromGroup(api.getCurrentUserID(), item.threadID);
      }
    });
    await api.sendMessage('Out of all other groups successfully', event.threadID);
  } catch (err) {
    console.error(err);
  }
};
