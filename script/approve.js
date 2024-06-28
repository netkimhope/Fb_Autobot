module.exports.midoriya = {
  name: "approve",
  desc: "Approve pending group",
  Coded_by: "Deku",
  usages: "[group id(threadID)]",
  permission: true,
  prefix: true
}

this['botStart'] = async function ({ api, event, input }) {
  try {
    const message = `${global.midoriya.prefix}${global.midoriya.name} connected!\nSorry if it took a while for the bot to respond to this group, because this group is in the bot's message request`;
    let thread = parseInt(input[0]);
    if (isNaN(thread)) return api.sendMessage("Invalid ID", event.threadID, event.messageID);
    if (!thread) return api.sendMessage("Missing group ID", event.threadID, event.messageID);
    /*const threadExists = await api.getThreadInfo(thread).catch(() => false);
    if (!threadExists) return api.sendMessage("Invalid thread ID", event.threadID, event.messageID);*/
    api.sendMessage(message, thread);
    api.changeNickname(`${global.midoriya.name} • [ ${global.midoriya.prefix} ]`, thread, api.getCurrentUserID());
    return api.sendMessage("Group ID " + thread + " approve successfully", event.threadID, event.messageID);
  } catch (err) {
    // Handle the error here
    console.error(err);
    api.sendMessage("An error occurred while approving the group", event.threadID, event.messageID);
  }
                           }