module.exports.config = {
  name: "balance",
  aliases: ["bal", "moneys", "earnings", "credits", "credit", "money"],
  version: "1.0.0",
  role: 0,
  info: "Check your current balance.",
  type: "currency",
  credits: "Kenneth Panio",
  cd: 0
};

module.exports.run = async function({ api, event, Currencies }) {
  const { threadID, senderID } = event;

  try {
    const userName = await getUserName(api, senderID);

    const userData = await Currencies.getData(senderID);
    const userBalance = userData.money;

    const responseMessage = `------------------------\n👤 Name: ${userName}\n💰 Current Balance: $${userBalance.toLocaleString()}\n------------------------`;

    api.sendMessage(responseMessage, threadID);
  } catch (error) {
    api.sendMessage("⚠️ | Oops! An error occurred while fetching your earnings. Please try again later.", threadID);
  }
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