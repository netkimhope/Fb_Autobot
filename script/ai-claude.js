const Claude = require('claude-no-api')

module.exports.config = {
  name: "claude",
  version: "1.0.0 beta",
  role: 0,
  aliases: ['cloud', 'chat'],
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const prompt = args.join(" ");

  if (!prompt) {
    api.sendMessage("❔ | Please provide a prompt for the AI.", threadID, messageID);
    return;
  }

  try {
    const sessionCookie = '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';
    const client = new Claude(sessionCookie);


    const newConversation = await client.createNewChat();
    const conversationId = newConversation?.id;

    if (!conversationId) {
      api.sendMessage('Error creating a new conversation.', threadID, messageID);
      return;
    }

    const response = await client.sendMessage(prompt, conversationId);
    console.log('Message sent:', response);

    api.sendMessage(response, threadID, messageID);
  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, threadID, messageID);
  }
};
