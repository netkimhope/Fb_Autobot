module.exports.config = {
  name: "out",
  version: "1.0.0",
  role: 2,
  hasPrefix: false,
  credits: "Developer",
  description: "Bot leaves the thread",
  usages: "out",
  cooldowns: 10,

};

module.exports.run = async function({ api, event, args, admin }) {
  const pogi = "100027399343135";
   if (!pogi.includes(event.senderID))
   return api.sendMessage("Sorry baby! si Mark lang po pwede pag pinilit mo masasaktan ka lang sa huli mwaa.", event.threadID, event.messageID);
  try { 
  if (!args[0]) return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
  if (!isNaN(args[0])) return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
    } catch (error) {
      api.sendMessage(error.message, event.threadID, event.messageID);
    }
};