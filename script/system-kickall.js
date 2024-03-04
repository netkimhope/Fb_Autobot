module.exports.config = {
  name: "kickall",
  aliases: ['fuckgc', 'kickeveryone', 'impostorkick', 'impostor-kick'],
  version: "1.0.0",
  role: 1,
  credits: "Khánh Milo",
  info: "Kick out all the member inside of the group and leave the group automatically",
  type: "moderation",
  cd: 5,
};

module.exports.run = async function({ api, event, args }) {
  var threadInfo = await api.getThreadInfo(event.threadID)
  var id = threadInfo.participantIDs
  const user = args.join(" ")
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  for (let user of id) {
    await delay(5000)
    api.removeUserFromGroup(user, event.threadID, user);
  }
};