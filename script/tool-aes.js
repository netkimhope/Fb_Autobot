const CryptoJS = require('crypto-js');

module.exports.config = {
  name: "aes",
  version: "1.0.2",
  role: 0,
  credits: "Kenneth Panio",
  info: "AES encryption/decryption",
  type: "tools",
  usage: "[enc|dec] [text] [level]",
  cd: 0
};

module.exports.run = ({ api, event, args }) => {
  const command = args[0];
  const text = args.slice(1).join(" "); // Join text elements starting from index 1
  const iterations = parseInt(args[args.length - 1]) || 1; // Use the last element as iterations
  const secretKey = 'mySecretKey';

  if (!command || !text || isNaN(iterations) || iterations <= 0) {
    return api.sendMessage('Usage: [enc|dec] [text] [iterations]', event.threadID, event.messageID);
  }

  switch (command) {
    case "enc": {
      let encryptedText = text;
      for (let i = 0; i < iterations; i++) {
        encryptedText = encrypt(encryptedText, secretKey);
      }
      api.sendMessage(`${encryptedText}`, event.threadID, event.messageID);
      break;
    }
    case "dec": {
      let decryptedText = text;
      for (let i = 0; i < iterations; i++) {
        decryptedText = decrypt(decryptedText, secretKey);
      }
      api.sendMessage(`${decryptedText}`, event.threadID, event.messageID);
      break;
    }
    default:
      api.sendMessage('Invalid command. Usage: [enc|dec] [text] [level]', event.threadID, event.messageID);
  }
};

const encrypt = (text, secretKey) => {
  const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
  return ciphertext;
};

const decrypt = (ciphertext, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
