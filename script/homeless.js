module.exports.config = {
  name: "homeless",
  role: 0,
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
      api.sendMessage("You're already broke! go somewhere and beg for money!.", threadID);
      return;
    }

    const reduceAmount = currentBalance;

    await Currencies.decreaseMoney(senderID, reduceAmount);

    api.sendMessage(`💸 | Oops! You've  become broke. Embrace the financial challenge! check your balance and see what happen.🤣😂`, threadID);
  } catch (error) {
    console.error("Error in becomebroke command:", error);
  }
};