const { get } = require('axios');

module.exports = {
  config: {
    name: "netflix",
    credits: 'atomic slash studio & ccto api deku',
    version: "1.0.0",
    info: 'search adult content',
    type: 'nsfw',
    aliases: ["vitamins", "pinayflix", "redroom"],
    role: 0,
    cd: 10,
  },
  run: async ({ chat, args, event }) => {
    try {
      const { messageID } = event;
      const waitMessage = await chat.reply("Please wait a few minutes...");

      const baseUrl = "https://porn-api-caf399424e79.herokuapp.com/prn/";
      const endpoint = args.length > 0 ? `search/${encodeURIComponent(args.join(" "))}` : "home";
      const { data: { result } } = await get(baseUrl + endpoint);

      if (!result || result.length === 0) {
        await chat.reply("No results found.");
        await waitMessage.unsend();
        return;
      }

      const videoUrl = result[Math.floor(Math.random() * result.length)].video;
      const { data: { result: downloadResult } } = await get(`${baseUrl}download?url=${videoUrl}`);

      if (!downloadResult || !downloadResult.contentUrl || !downloadResult.contentUrl.Low_Quality) {
        await chat.reply("Failed to retrieve the video from api!");
        await waitMessage.unsend();
        return;
      }

      const streamUrl = downloadResult.contentUrl.Low_Quality;
      const response = await get(streamUrl, { responseType: "stream" });

      const netflix = await chat.reply({ attachment: response.data });
      netflix.unsend(120000);
      await waitMessage.unsend();
    } catch (error) {
      const suppressedErrors = [
        /Converting circular structure to JSON/,
        /parseAndCheckLogin got status code: 404/
      ];
      if (suppressedErrors.some(regex => regex.test(error.message))) {
        return;
      }
      chat.reply(`Error: ${error.message || "Possible Reason: Account Temporarily Restricted. Can't use features like sending attachment pictures, videos, gifs, or audio."}`);
    }
  }
};￼Enter
