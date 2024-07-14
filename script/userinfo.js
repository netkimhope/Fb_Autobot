module.exports = class {
  static get config() {
    return {
      name: "userinfo",
      description: "Important Fbbot related infos.",
      usage: "",
      credits: "Liane",
      author: "Liane",
      category: "Info",
      usePrefix: false,
      aliases: [],
      role: 0,
      hasPermssion: 0,
      commandCategory: "Info",
    };
  }
  static get metadata() {
    return this.config;
  }
  static get onRun() {
    return this.run;
  }
  static get onStart() {
    return this.run;
  }
  static get run() {
    return async ({ event, api, args }) => {
      let ID = event.senderID;
      if (Object.keys(event.mentions).length > 0) {
        ID = Object.keys(event.mentions)[0];
      }
      if (event.messageReply) {
        ID = event.messageReply.senderID;
      }
      if (args[0] === "raw") {
        return api.sendMessage(`${ID}`, event.threadID, event.messageID);
      }
      if (args[0] === "tid") {
        return api.sendMessage(`${event.threadID}`, event.threadID, event.messageID);
      }
      const { [ID]: info } = await api.getUserInfo(ID);
      await api.sendMessage(`📛 ${info.name}${info.vanity ? `\n📝 ${info.vanity}` : ""}${info.alternateName ? `\n✨ ${info.alternateName}` : ""}
${info.gender === 1 ? "👧 Female" : "👦 Male"}

𝙄𝘿: ${ID}
𝙏𝙄𝘿: ${event.threadID}`, event.threadID, event.messageID);
    };
  }
};
