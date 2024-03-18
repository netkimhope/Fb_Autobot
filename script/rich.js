module.exports.config = {
  name: "topmoney",
  aliases: ["topbalance", "richlist"],
  version: "1.0.0",
  role: 0,
  info: "Show the top 5 users with the highest money in the group.",
  type: "currency",
  credits: "Kenneth Panio",
  cd: 0,
};

module.exports.run = async function ({ api, event, Currencies }) {
  const { threadID } = event;

  try {
    // Get user data for all participants in the current thread
    const participantData = await Promise.all(
      (await api.getThreadInfo(threadID)).participantIDs.map(async (userID) => {
        const userName = await getUserName(api, userID);
        const userData = await Currencies.getData(userID);
        return { userID, userName, money: userData.money };
      })
    );

    // Sort participants by money in descending order
    const topParticipants = participantData.sort((a, b) => b.money - a.money).slice(0, 5);

    // Create a response message
    const responseMessage = topParticipants.map(
      (user, index) =>
        `${index + 1}.  ${user.userName}: $${user.money.toLocaleString()}`
    );

    // Send the response message
    api.sendMessage(`Top 5 Money Leaders:\n${responseMessage.join("\n")}`, threadID);
  } catch (error) {
    api.sendMessage(
      "⚠️ | Oops! An error occurred while fetching the top money leaders. Please try again later.",
      threadID
    );
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