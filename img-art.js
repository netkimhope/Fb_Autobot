function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const axios = require("axios");

module.exports.config = {
  name: "art",
  version: "1.0.0",
  role: 0,
  credits: "Kenneth Panio",
  info: "Convert your images to anime",
  type: "Developer",
  usage: "[reply to image]",
  cd: 0
};

module.exports.run = async function ({ api, args, event }) {

  let bb = args[0];
  if (!bb) {
    bb = 1;
  }

  if (isNaN(bb)) {
    return box.send("Enter a number after Art, not just random words from your mind", event.threadID);
  }
  if (parseInt(bb) < 1) {
    return api.sendMessage("Continue being creative\n\nPut a number from 1 and above, don't mess around 🙂🚮", event.threadID);
  }
  if (parseInt(bb) > 21) {
    return api.sendMessage("Not allowed more than 21 🙂🚶🏻", event.threadID);
  }

  if (!["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
    return api.sendMessage("Reply with a photo 🙂🚮", event.threadID);
  }

  const imageUrl = event.messageReply.attachments[0].url;
  const encodedImageUrl = encodeURIComponent(imageUrl);

  api.sendMessage("Wait", event.threadID, async (err, si) => {
    const mid = si.messageID;
    await delay(500);
    api.editMessage("Wait a moment ♡", mid);

    const response = await axios.get(`https://simoapi-aimirror.onrender.com/generate?imageUrl=${encodedImageUrl}&modelNumber=${bb}`);
    api.editMessage("Wait a moment ♡♡♡", mid);
    const url = response.data.imageUrl;
    const mod = response.data.modelName;
    const Stream = await global.funcs.getStreamFromURL(url);

    api.editMessage("Wait a moment ♡♡♡♡♡", mid);

    await api.sendMessage({
      body: `♡◄∘ Here you go dear ~♡ ∘►♡⇡\n\n♡◄∘ Type: ${bb} ∘►♡⇡\n\n♡◄∘ Model: ${mod} ∘►♡⇡`,
      attachment: Stream,
    }, event.threadID);
    api.unsendMessage(mid);
  });
}
