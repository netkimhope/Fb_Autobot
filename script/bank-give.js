module.exports.config = {
  name: "give",
  version: "1.0.0",
  info: 'Give money to another user',
  type: 'economy',
  role: 0,
  aliases: ['donate'],
  usage: '[uid or mention]',
  cd: 5
};

module.exports.run = async function ({ api, event, args, Currencies }) {
  const { threadID, senderID, mentions } = event;

  const threadInfo = await api.getThreadInfo(threadID);
  const participantIDs = threadInfo.participantIDs;

  const amountToGive = parseInt(args[0]);
  const targetUserInput = args.slice(1).join(' ');

  if (isNaN(amountToGive) || !targetUserInput) {
    return api.sendMessage('❌ | Invalid usage. Please use: give [amount] [user ID, mention, or name]', threadID);
  }

  let targetUserID;

  // Check if targetUserInput is a UID
  if (/^\d+$/.test(targetUserInput)) {
    targetUserID = targetUserInput;
  } else {
    // If not a UID, check if it's a mention
    targetUserID = Object.keys(mentions)[0];

    // If not a mention, check if it's a name
    if (!targetUserID) {
      for (const user of participantIDs) {
        const userName = (await api.getUserInfo(user)).name.toLowerCase().replace(/\s+/g, '');
        if (userName === targetUserInput.toLowerCase().replace(/\s+/g, '')) {
          targetUserID = user;
          break;
        }
      }

      // Handle no matches for the provided name
      if (!targetUserID) {
        return api.sendMessage(`❓ | There is no user with the name, ID, or mention "${targetUserInput}". Please provide a valid user ID, mention, or name.`, threadID);
      }
    }
  }

  const senderBalance = (await Currencies.getData(senderID)).money;

  if (senderBalance < amountToGive) {
    return api.sendMessage('💰 | Insufficient funds. You cannot give more money than you have.', threadID);
  }

  await Currencies.decreaseMoney(senderID, amountToGive);
  await Currencies.increaseMoney(targetUserID, amountToGive);

  const recipientName = (await api.getUserInfo(targetUserID)).name || "Unknown";

  api.sendMessage(`💸 | You gave $${amountToGive.toLocaleString()} to ${recipientName}.`, threadID);
};
