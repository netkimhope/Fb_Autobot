const fs = require("fs");
module.exports.config = {
        name: "autoreact",
  version: "1.0.0",
        hasPermssion: 0,
        credits: "Minami Tatsuo",
        description: "non prefix reply",
        commandCategory: "no prefix",
        usages: "noprefix",
    cooldowns: 0,
};
 
module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
 let haha = event.body.toLowerCase();
  if (haha.includes("lol") || haha.includes("😂") || haha.includes("haha") || haha.includes("pagal") || haha.includes("mental") || haha.includes("oye") || haha.includes("love") || haha.includes("jani") || haha.includes("bc") || haha.includes("busy") || 
haha.includes("group") || haha.includes("kis") || haha.includes("kuta") || haha.includes("jan") || haha.includes("oh")){                 
    return api.setMessageReaction("😆", event.messageID, (err) => {}, true)
    api.markAsSeen(1, (err) => {});
  }
    if (haha.includes("death") || haha.includes("mar") || haha.includes("udas") || haha.includes("☹️") || haha.includes("hurt") || haha.includes("please") || haha.includes("pls") || haha.includes("😢") || haha.includes("😔") || haha.includes("🥺") || haha.includes("sad")){
      return  api.setMessageReaction("😢", event.messageID, (err) => {}, true);
}
  if (haha.includes("🥵") || haha.includes("umah") || haha.includes("💋") || haha.includes("kiss") || haha.includes("babu") || haha.includes("baby") || haha.includes("wow") || haha.includes("wah") || haha.includes("relationship") || haha.includes("gf") || haha.includes("baby") || haha.includes("omg")){
    return api.setMessageReaction("😘", event.messageID, (err) => {}, true)
  }
  if (haha.includes("tite") || haha.includes("Tite")){
    api.sendMessage("tite ka nang tite lika dito subuin moto.", event.threadID, event.messageID)
  }
  if (haha.includes("Umay") || haha.includes("umay")){
    api.sendMessage("Umay talaga wala kang tatay eh", event.threadID, event.messageID)
  }
  if (haha.includes("bot") || haha.includes("Bot")){
    api.sendMessage("oo na bot na kinginamo ka", event.threadID, event.messageID)
  }
if (haha.includes("ralph") || haha.includes("Ralph")){
    api.sendMessage("Ralph pogi malake etits", event.threadID, event.messageID)
}
  if (haha.includes("kick") || haha.includes("Kick")){
    api.sendMessage("ikaw dapat kinikick eh wala ka namang dulot sa pinas putanginamo di ka mahal ng magulang mo bobo ka", event.threadID, event.messageID)
      }
}
        module.exports.run = function({ api, event, client, __GLOBAL }) {
      }