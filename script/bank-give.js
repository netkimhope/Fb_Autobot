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

const userCache = {}; // Cache to store user names

module.exports.run = async function ({ api, event, args, Currencies }) {
  const { threadID, senderID, mentions } = event;

  // Fetch participant IDs and names if not already cached
  const threadInfo = await api.getThreadInfo(threadID);
  const participantIDs = threadInfo.participantIDs;
  for (const participantID of participantIDs) {
    await getUserNameCached(api, participantID);
  }

  // Check if the command includes an amount and target user ID, mention, or name
  const amountToGive = parseInt(args[0]);
  const targetUserInput = args.slice(1).join(' ');

  if (isNaN(amountToGive) || !targetUserInput) {
    api.sendMessage('❌ | Invalid usage. Please use: give [amount] [user ID, mention, or name]', threadID);
    return;
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
      for (const participantID of participantIDs) {
        const userName = userCache[participantID];
        const fullName = userName.toLowerCase().replace(/\s+/g, ''); // Remove spaces from full name
        if (fullName === targetUserInput.toLowerCase().replace(/\s+/g, '')) {
          targetUserID = participantID;
          break; // Stop searching once a match is found
        }
      }

      // Handle no matches for the provided name
      if (!targetUserID) {
        api.sendMessage(`❓ | There is no user with the name "${targetUserInput}". Please provide a valid user ID, mention, or name.`, threadID);
        return;
      }
    }
  }

  // Check if the sender has enough money to give
  const senderBalance = (await Currencies.getData(senderID)).money;

  if (senderBalance < amountToGive) {
    api.sendMessage('💰 | Insufficient funds. You cannot give more money than you have.', threadID);
    return;
  }

  // Update balances for sender and target user
  await Currencies.decreaseMoney(senderID, amountToGive);
  await Currencies.increaseMoney(targetUserID, amountToGive);

  // Get names of sender and recipient using the provided function
  const senderName = await getUserNameCached(api, senderID);
  const recipientName = await getUserNameCached(api, targetUserID);

  const newSenderBalance = (senderBalance - amountToGive).toLocaleString();
  const targetUserBalance = (await Currencies.getData(targetUserID)).money.toLocaleString();

  api.sendMessage(`💸 | You gave $${amountToGive.toLocaleString()} to ${recipientName}.`, threadID);
};

async function getUserNameCached(api, userID) {
  if (!userCache[userID]) {
    try {
      const userInfo = await api.getUserInfo(userID);
      if (userInfo && userInfo[userID]) {
        const userName = userInfo[userID].name;
        userCache[userID] = userName;
      } else {
        userCache[userID] = "Unknown";
      }
    } catch (error) {
      userCache[userID] = "Unknown";
    }
  }

  return userCache[userID];
}
