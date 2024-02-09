const akaneko = require('akaneko');
const fs = require('fs');

module.exports.config = {
  name: 'akaneko',
  version: '1.0.0',
  role: 0,
  aliases: ['rule34', 'r18']
};

module.exports.run = async function({ api, event, args }) {
  try {
    const input = args.join(' ');
    if (!input) {
      const message = `Here's the list of anime categories:\n\nCategory: nsfw\nType:\n• neko\n• hentai\n• bdsm\n• feet\n• thighs\n\nCategory: sfw\nType:\n• neko\n• foxgirl\n• wallpaper`;
      api.sendMessage(message, event.threadID, event.messageID);
    } else {
      const [category, type] = input.split('-').map(item => item.trim());
      let imageURL;

      if (category === 'nsfw') {
        switch (type) {
          case 'neko':
            imageURL = await akaneko.nsfw.neko();
            break;
          case 'hentai':
            imageURL = await akaneko.nsfw.hentai();
            break;
          case 'bdsm':
            imageURL = await akaneko.nsfw.bdsm();
            break;
          case 'feet':
            imageURL = await akaneko.nsfw.feet();
            break;
          case 'thighs':
            imageURL = await akaneko.nsfw.thighs();
            break;
          default:
            api.sendMessage(`Invalid NSFW type: ${type}`, event.threadID);
            return;
        }
      } else if (category === 'sfw') {
        switch (type) {
          case 'neko':
            imageURL = await akaneko.neko();
            break;
          case 'foxgirl':
            imageURL = await akaneko.foxgirl();
            break;
          case 'wallpaper':
            imageURL = await akaneko.wallpapers();
            break;
          default:
            api.sendMessage(`Invalid SFW type: ${type}`, event.threadID);
            return;
        }
      } else {
        api.sendMessage(`Invalid category: ${category}`, event.threadID);
        return;
      }

      const pictureData = await axios.get(imageURL, { responseType: 'arraybuffer' });
      const pathPic = `${__dirname}/cache/${category}_${type}_${Date.now()}.png`;
      fs.writeFileSync(pathPic, Buffer.from(pictureData.data, 'utf-8'));

      api.sendMessage({
        body: '',
        attachment: fs.createReadStream(pathPic)
      }, event.threadID, () => fs.unlinkSync(pathPic), event.messageID);
    }
  } catch (error) {
    api.sendMessage(`Error in the anime command: ${error.message}`, event.threadID);
  }
};
