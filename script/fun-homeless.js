module.exports.config = {
  name: "homeless",
  role: 2,
  version: "1.0.0",
  info: "Embrace financial challenges throws away your money and start back to zero again",
  type: "currency",
  aliases: ["becomehomeless", "bum", "becomepoor", "becomebroke"],
  cd: 30,
};

module.exports.run = async function ({ api, event, Currencies }) {
  try {
    const { threadID, senderID } = event;

    const userData = await Currencies.getData(senderID);
    const currentBalance = userData.money || 0;

    if (currentBalance === 0) {
      api.sendMessage("You're already broke! Embrace the financial challenge elsewhere.", threadID);
      return;
    }

    const reduceAmount = currentBalance;

    await Currencies.decreaseMoney(senderID, reduceAmount);

    api.sendMessage(`💸 | Oops! You've  become broke. Your total balance is now $0 credits. Embrace the financial challenge!`, threadID);
  } catch (error) {
    console.error("Error in becomebroke command:", error);
  }
};
