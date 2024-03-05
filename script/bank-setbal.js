module.exports.config = {
  name: "setbal",
  version: "1.0.0",
  info: 'Set the balance of a user',
  type: 'economy',
  role: 2,
  credits: 'Kenneth Panio',
  aliases: ['setbalance'],
  usage: '[newBalance] [uid, mention, or name]',
  cd: 5
};

module.exports.run = async function ({ api, event, args, Currencies }) {
  const { threadID, senderID, mentions } = event;

  const threadInfo = await api.getThreadInfo(threadID);
  const participantIDs = threadInfo.participantIDs;

  const newBalance = parseInt(args[0]);
  const targetUserInput = args.slice(1).join(' ');

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

  const currentBalance = (await Currencies.getData(targetUserID)).money;

  // If a new balance is provided, set it; otherwise, reset the balance
  const updatedBalance = newBalance ? newBalance : 0;

  await Currencies.setData(targetUserID, { money: updatedBalance });

  const recipientName = (await api.getUserInfo(targetUserID)).name || "Unknown";

  api.sendMessage(`💰 | ${recipientName}'s balance set to $${updatedBalance.toLocaleString()}.`, threadID);
};
