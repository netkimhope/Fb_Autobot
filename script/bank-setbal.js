module.exports.config = {
  name: "setbal",
  version: "1.0.0",
  info: 'Set the balance of a user',
  type: 'economy',
  role: 2,
  aliases: ['setbalance'],
  usage: '[amount] [optional: uid or mention]',
  cd: 5
};

module.exports.run = async function ({ api, event, args, Currencies }) {
  const { threadID, mentions, senderID } = event;

  if (args.length < 1 || isNaN(args[0])) {
    return api.sendMessage(`❓ | Invalid usage. Please use: \`setbal [amount] [optional: uid or mention]\``, threadID);
  }

  const amountToSet = parseInt(args[0]);
  let targetUserID = senderID;

  if (args.length > 1) {
    // Check if a user ID is provided in the command
    const providedUserID = args[1];
    if (/^\d+$/.test(providedUserID)) {
      targetUserID = providedUserID;
    } else {
      // If not a valid user ID, assume it's a mention
      targetUserID = Object.keys(mentions)[0];
    }
  }

  const currentBalance = (await Currencies.getData(targetUserID)).money || 0;

  await Currencies.decreaseMoney(targetUserID, currentBalance);
  await Currencies.increaseMoney(targetUserID, amountToSet);

  api.sendMessage(`💸 | You set the balance to $${amountToSet.toLocaleString()} for the user with ID ${targetUserID}.`, threadID);
};
