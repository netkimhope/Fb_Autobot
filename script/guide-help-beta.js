module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  aliases: ['info'],
  info: "Beginner's guide",
  usage: "[page] or [command]",
  credits: 'Developer',
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
    const allowedCommands = enableCommands[0].commands;

    if (!input) {
      const formattedCommands = allowedCommands
        .map((commandName) => {
          const commandInfo = Utils.commands[commandName];
          const aliases = commandInfo.aliases ? `(Aliases: ${commandInfo.aliases.join(', ')})` : '';
          return `►〔 ${commandName} 〕- ${commandInfo.info} ${aliases}`;
        })
        .join('\n');

      const helpMessage = `📒 | 𝗛𝗲𝗹𝗽 𝗟𝗶𝘀𝘁:\n${formattedCommands}`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else {
      const commandInfo = Utils.commands[input.toLowerCase()];

      if (commandInfo) {
        const {
          name,
          version,
          role,
          aliases = [],
          info,
          usage,
          credits,
          cd,
        } = commandInfo;

        const roleMessage = role !== undefined ? `➛ Permission: ${getPermissionRole(role)}` : '';
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

module.exports.handleEvent = async function({
  api,
  event,
  prefix
}) {
  const {
    threadID,
    messageID,
    body
  } = event;
  const message = prefix ? 'This is my prefix: ' + prefix : "Sorry, I don't have a prefix";
  if (body?.toLowerCase().startsWith('prefix')) {
    api.sendMessage(message, threadID, messageID);
  }
};

function getPermissionRole(role) {
  switch (role) {
    case 0:
      return 'user';
    case 1:
      return 'admin';
    case 2:
      return 'thread Admin';
    case 3:
      return 'super Admin';
    default:
      return '';
  }
}
