module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  aliases: ['info'],
  info: "Beginner's guide",
  usage: "[page] or [command]",
  credits: 'Developer',
};

module.exports.run = async function ({ api, event, enableCommands, args, Utils, prefix }) {
  const input = args.join(' ');
  const [eventCommands, commands] = [enableCommands[1].handleEvent, enableCommands[0].commands];

  try {
    if (!input) {
      const pages = 20, page = 1, start = (page - 1) * pages, end = start + pages;
      let helpMessage = `📚 | 𝗖𝗠𝗗 𝗟𝗜𝗦𝗧: 〔${prefix}〕\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(commands[i].toLowerCase()))?.[1];

        if (command) {
          const { name, info, usage } = command;
          helpMessage += `\t${i + 1}. ►〔 ${name} 〕 ${usage ? `${usage}` : ''}\n- ${info}\n\n`;
        }
      }

      helpMessage += `\nPage ${page}/${Math.ceil(commands.length / pages)}. To view the next page, type '${prefix}help page number'. To view information about a specific command, type '${prefix}help command name'.`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else if (!isNaN(input)) {
      const page = parseInt(input), pages = 20, start = (page - 1) * pages, end = start + pages;
      let helpMessage = `📚 | 𝗖𝗠𝗗 𝗟𝗜𝗦𝗧: 〔${prefix}〕\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(commands[i].toLowerCase()))?.[1];

        if (command) {
          const { name, info, usage } = command;
          helpMessage += `\t${i + 1}. ►〔 ${name} 〕 ${usage ? `${usage}` : ''}\n- ${info}\n\n`;
        }
      }

      helpMessage += `\nPage ${page} - ${Math.ceil(commands.length / pages)}`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else {
      const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input?.toLowerCase()))?.[1];

      if (command) {
        const { name, version, role, aliases = [], info, usage, credits, cd, hasPrefix } = command;
        const roleMessage = role !== undefined ? (role === 0 ? '➛ Permission: user' : (role === 1 ? '➛ Permission: admin' : (role === 2 ? '➛ Permission: thread Admin' : (role === 3 ? '➛ Permission: super Admin' : '')))) : '';
        const aliasesMessage = aliases.length ? `➛ Aliases: ${aliases.join(', ')}\n` : '';
        const descriptionMessage = info ? `Description: ${info}\n` : '';
        const usageMessage = usage ? `➛ Usage: ${usage}\n` : '';
        const creditsMessage = credits ? `➛ Credits: ${credits}\n` : '';
        const versionMessage = version ? `➛ Version: ${version}\n` : '';
        const cooldownMessage = cd ? `➛ Cooldown: ${cd} second(s)\n` : '';
        const message = ` 「 Command 」\n\n➛ Name: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage('Command not found.', event.threadID, event.messageID);
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
