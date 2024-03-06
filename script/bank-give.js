module.exports.config = {
  name: "give",
  version: "1.0.0",
  info: 'Give money to another user',
  type: 'economy',
  role: 0,
  aliases: ['donate'],
  usage: '[amount] [uid, mention, or name]',
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
  if (!isNaN(parseInt(targetUserInput))) {
    targetUserID = targetUserInput;
  } else {
    // If not a UID, check if it's a mention
    targetUserID = Object.keys(mentions)[0];

    // If not a mention, check if it's a name
    if (!targetUserID) {
      const matchedUsers = await findUsersByName(api, targetUserInput, participantIDs);

      // Handle no matches for the provided name
      if (matchedUsers.length === 0) {
        return api.sendMessage(`❓ | There is no user with the name, ID, or mention "${targetUserInput}". Please provide a valid user ID, mention, or name.`, threadID);
      }

      // Use the first matched user ID
      targetUserID = matchedUsers[0].userID;
    }
  }

  const senderBalance = (await Currencies.getData(senderID)).money;

  if (senderBalance < amountToGive) {
    return api.sendMessage('💰 | Insufficient funds. You cannot give more money than you have.', threadID);
  }

  // Decrease the sender's balance by the specified amount
  await Currencies.decreaseMoney(senderID, amountToGive);

  // Increase the target user's balance by the specified amount
  await Currencies.increaseMoney(targetUserID, amountToGive);

  const recipientName = (await api.getUserInfo(targetUserID)).name || "Unknown";

  api.sendMessage(`💸 | You gave $${amountToGive.toLocaleString()} to ${recipientName}.`, threadID);
};

async function findUsersByName(api, targetName, participantIDs) {
  const matchedUsers = await Promise.all(participantIDs.map(async (participantID) => {
    const userName = await getUserName(api, participantID);
    return {
      userID: participantID,
      userName: userName.toLowerCase(),
    };
  }));

  return matchedUsers.filter(user => user.userName.includes(targetName.toLowerCase()));
}

async function getUserName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);
    if (userInfo && userInfo[userID]) {
      return userInfo[userID].name.toLowerCase();
    } else {
      return "Unknown";
    }
  } catch (error) {
    return "Unknown";
  }
}
