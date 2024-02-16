module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  aliases: ['info', 'cmd', 'list', 'commands']
};
module.exports.run = async function({
  api,
  event,
  enableCommands,
  args,
  Utils,
  prefix
}) {
  const input = args.join(' ');
  try {
    const eventCommands = enableCommands[1].handleEvent;
    const commands = enableCommands[0].commands;
    const commandInfo = Utils.commands.find(([key]) => key === commands)?.[1];
    const commandUsage = commandInfo ? `Usage: ${commandInfo.usage || 'Not specified'}` : '';
    if (!input) {
      const pages = 20;
      let page = 1;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = `𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦\n\n`;
      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\t${i + 1}. ${prefix}${commands[i]}\n`;
      }
      helpMessage += '\n𝗘𝗩𝗘𝗡𝗧𝗦\n\n';
      eventCommands.forEach((eventCommand, index) => {
        helpMessage += `\t${index + 1}. ${prefix}${eventCommand}\n`;
      });
      helpMessage += `\nPage ${page}/${Math.ceil(commands.length / pages)}. To view the next page, type '${prefix}help page number'. To view information about a specific command, type '${prefix}help command name'.`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else if (!isNaN(input)) {
      const page = parseInt(input);
      const pages = 20;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = `𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦\n\n`;
      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\t${i + 1}. 「 ${prefix}${commands[i]} 」\n`;
      }
      helpMessage += '\n𝗘𝗩𝗘𝗡𝗧𝗦\n\n';
      eventCommands.forEach((eventCommand, index) => {
        helpMessage += `\t${index + 1}. ${prefix}${eventCommand}\n`;
      });
      helpMessage += `\nPage ${page} of ${Math.ceil(commands.length / pages)}`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else {
      const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input?.toLowerCase()))?.[1];
      if (command) {
        const {
          name,
          version,
          role,
          aliases = [],
          info,
          type,
          description,
          usage,
          credits
        } = command;
        const roleMessage = role !== undefined ? (role === 0 ? '𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡: Group Members & Bot Users' : (role === 1 ? '𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡: Bot Admin' : (role === 2 ? '𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡: Group Admin and Bot Admin' : (role === 3 ? '𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡: Bot Moderator & Bot Administrator' : '')))) : '';
        const aliasesMessage = aliases.length ? `Aliases: ${aliases.join(', ')}\n` : '';
        const descriptionMessage = info ? `𝗜𝗡𝗙𝗢: ${info}\n` : '';
        const typeMessage = type ? `𝗧𝗬𝗣𝗘: ${type}\n` : '';
        const usageMessage = usage ? `𝗨𝗦𝗔𝗚𝗘: ${usage}\n` : '';
        const creditsMessage = credits ? `𝗔𝗨𝗧𝗛𝗢𝗥: ${credits}\n` : '';
        const message = `𝗡𝗔𝗠𝗘: ${name}\n𝗩𝗘𝗥𝗦𝗜𝗢𝗡: ${version}\n${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}`;
        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage('Command not found.', event.threadID, event.messageID);
      }
    }
  } catch (error) {
    console.log(error);
  }
};