const fs = require("fs");

module.exports = {
  config: {
    name: "teach",
    aliases: ["th"],
    version: "1.0",
    author: "Deku/kira",
    usages: "teach <text> - <respond>",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "teach cain"
    },
    longDescription: {
      en: "teach cain"
    },
    category: "box chat",
    guide: {
      en: "{p}teach <text> - <respond>"
    }
  },

  onStart: async function({ api, event, args }) {
    let tid = event.threadID,
      mid = event.messageID;

    let path = 'scripts/cmds/others/sim.json'; // Changed path here
    let data = JSON.parse(fs.readFileSync(path));

    const content = args.join(" ").split("-").map(item => item.trim());
    let ask = content[0];
    let ans = content[1];

    if (!ask || !ans) {
      return api.sendMessage(
        "Missing ans or ask query!\nUse: " + global.config.prefix + this.config.name + " " + this.config.usages,
        tid,
        mid
      );
    }

    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify({}));
    }

    if (!data[ask]) {
      data[ask] = [];
    }

    if (data[ask].includes(ans)) {
      return api.sendMessage("Already taught\nTry teaching a different ask or ans", tid, mid);
    }

    api.sendMessage(
      "Thanks for teaching me!\n\nYour ask: " + ask + "\nSim response: " + ans,
      tid,
      mid
    );

    data[ask].push(ans);
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
  }
};
