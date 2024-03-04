module.exports.config = {
  name: "uid",
  version: "1.2.0",
  role: 0,
  aliases: ['id', 'userid', 'fbid', 'fb-id']
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, mentions, senderID } = event;

  // Check if a name is provided
  const targetName = args.join(' ');

  if (!targetName) {
    api.sendMessage(`Your User ID: ${senderID}`, threadID);
    return;
  }

  // If the user is mentioned, extract the user ID
  if (Object.keys(mentions).length > 0) {
    for (const mentionID in mentions) {
      const mentionName = mentions[mentionID].replace('@', '');
      api.sendMessage(`${mentionName}: ${mentionID}`, threadID);
    }
    return;
  }

  const threadInfo = await api.getThreadInfo(threadID);
  const participantIDs = threadInfo.participantIDs;

  const matchedUserIDs = await Promise.all(participantIDs.map(async (participantID) => {
    const userName = await getUserName(api, participantID);
    return {
      userID: participantID,
      userName: userName.toLowerCase(),
    };
  }));

  const matchedUsers = matchedUserIDs.filter(user => user.userName.includes(targetName.toLowerCase()));

  // Handle no matches for the provided name
  if (matchedUsers.length === 0) {
    api.sendMessage(`❓ | There is no user with the name "${targetName}" in the group.`, threadID);
    return;
  }

  const formattedList = matchedUsers.map((user, index) => `${index + 1}. ${user.userName}: ${user.userID}`).join('\n');

  api.sendMessage(`UID ${targetName}:\n${formattedList}`, threadID);
};

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
