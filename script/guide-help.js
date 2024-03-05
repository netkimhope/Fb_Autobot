module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  aliases: ['info'],
  info: "Beginner's guide",
  usage: "[Page-Number] or [Command Name]",
  credits: 'Developer',
};

module.exports.run = async function ({ api, event, enableCommands, args, Utils, prefix }) {
  const input = args.join(' ');
  const [eventCommands, commands] = [enableCommands[1].handleEvent, enableCommands[0].commands];

  try {
    if (!input) {
      const pages = 20, page = 1, start = (page - 1) * pages, end = start + pages;
        let helpMessage = `📚 | 𝗖𝗠𝗗 𝗟𝗜𝗦𝗧: 〔${prefix || 'ɴᴏ ᴘʀᴇғɪx'}〕\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(commands[i].toLowerCase()))?.[1];

        if (command) {
          const { name, info, usage } = command;
          helpMessage += `\t${i + 1}. ${name} ${usage ? `${usage}` : ''}\n`;
        }
      }

      helpMessage += `\nᴘᴀɢᴇ: ${page}/${Math.ceil(commands.length / pages)}. ᴛᴏ ᴠɪᴇᴡ ɴᴇxᴛ ᴘᴀɢᴇ, ᴛʏᴘᴇ '${prefix}ʜᴇʟᴘ [ᴘᴀɢᴇ-ɴᴜᴍʙᴇʀ]'. ᴛᴏ ᴠɪᴇᴡ ᴍᴏʀᴇ ɪɴғᴏʀᴍᴀᴛɪᴏɴ ᴀʙᴏᴜᴛ ᴄᴏᴍᴍᴀɴᴅ, ᴛʏᴘᴇ '${prefix}ʜᴇʟᴘ [ɴᴀᴍᴇ ᴏғ ᴄᴏᴍᴍᴀɴᴅ]'.`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else if (!isNaN(input)) {
      const page = parseInt(input), pages = 20, start = (page - 1) * pages, end = start + pages;
      let helpMessage = `📚 | 𝗖𝗠𝗗 𝗟𝗜𝗦𝗧: 〔${prefix || 'ɴᴏ ᴘʀᴇғɪx'}〕\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(commands[i].toLowerCase()))?.[1];

        if (command) {
          const { name, info, usage } = command;
          helpMessage += `\t${i + 1}. ${name} ${usage ? `${usage}` : ''}\n`;
        }
      }

      helpMessage += `\nᴘᴀɢᴇ ${page} - ${Math.ceil(commands.length / pages)}`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else {
      const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input?.toLowerCase()))?.[1];

      if (command) {
        const { name, version, role, aliases = [], info, usage, credits, cd, hasPrefix } = command;
        const roleMessage = role !== undefined ? (role === 0 ? 'ʀᴏʟᴇ: ᴜsᴇʀ' : (role === 1 ? 'ʀᴏʟᴇ: ʙᴏᴛ-ᴀᴅᴍɪɴ ᴏᴡɴᴇʀ' : (role === 2 ? 'ʀᴏʟᴇ: ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs' : (role === 3 ? 'ʀᴏʟᴇ: sᴜᴘᴇʀ ᴀᴅᴍɪɴs/ᴍᴏᴅᴇʀᴀᴛᴏʀs' : '')))) : '';
        const aliasesMessage = aliases.length ? `➛ ᴀʟɪᴀsᴇs: ${aliases.join(', ')}\n` : '';
        const descriptionMessage = info ? `ɪɴғᴏ: ${info}\n` : '';
        const usageMessage = usage ? `ᴜsᴀɢᴇ: ${usage}\n` : '';
        const creditsMessage = credits ? `ᴀᴜᴛʜᴏʀ: ${credits}\n` : '';
        const versionMessage = version ? `ᴠᴇʀsɪᴏɴ: ${version}\n` : '';
        const cooldownMessage = cd ? `ᴄᴏᴏʟᴅᴏᴡɴ: ${cd} second(s)\n` : '';
        const message = `𝗖𝗢𝗠𝗠𝗔𝗡𝗗\n\nɴᴀᴍᴇ: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage(`ᴄᴏᴍᴍᴀɴᴅ ᴅᴏᴇs'ɴᴛ ᴇxɪsᴛ!`, event.threadID, event.messageID);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.handleEvent = async function ({ api, event, prefix }) {
  const { threadID, messageID, body } = event;
  const message = prefix ? 'This is my prefix: ' + prefix : "Sorry, I don't have a prefix";

  if (body?.toLowerCase().startsWith('prefix')) {
    api.sendMessage(message, threadID, messageID);
  }
};
