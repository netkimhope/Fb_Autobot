module.exports.config = {
  name: "give",
  version: "1.0.0",
  info: 'Give money to another user',
  type: 'economy',
  role: 0,
  aliases: ['donate'],
  cd: 5
};

module.exports.run = async function({ api, event, args, Currencies }) {
  const { threadID, senderID, mentions } = event;

  // Check if the command includes an amount and target user ID or mention
  const amountToGive = parseInt(args[0]);
  const targetUserInput = args[1];

  if (isNaN(amountToGive) || !targetUserInput) {
    api.sendMessage('❌ | Invalid command format. Please use: give [amount] [user ID or mention]', threadID);
    return;
  }

  // Extract user ID from mention or use as is
  const targetUserID = Object.keys(mentions)[0] || targetUserInput || senderID;

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
  const senderName = await getUserName(api, senderID);
  const recipientName = await getUserName(api, targetUserID);

  const newSenderBalance = (senderBalance - amountToGive).toLocaleString();
  const targetUserBalance = (await Currencies.getData(targetUserID)).money.toLocaleString();

  api.sendMessage(`💸 | You gave $${amountToGive.toLocaleString()} to ${recipientName}.`, threadID);
};

async function getUserName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);
    if (userInfo && userInfo[userID]) {
      return userInfo[userID].name;
    } else {
      return "Unknown";
    }
  } catch (error) {
    return "Unknown";
  }
}
