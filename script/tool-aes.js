const CryptoJS = require('crypto-js');

module.exports.config = {
  name: "aes",
  version: "1.2.0",
  role: 0,
  credits: "Kenneth Panio",
  info: "AES encryption/decryption",
  type: "tools",
  usage: "[enc|dec] [iteration] [text]",
  cd: 0
};

module.exports.run = ({ api, event, args }) => {
  const allTypes = ["enc", "dec"];
  const command = args[0];
  const iterations = parseInt(args[1]);

  if (!command || !allTypes.includes(command) || isNaN(iterations) || iterations <= 0 || iterations > 10 || args.length < 3) {
    return api.sendMessage('Usage: [enc|dec] [1-10] [text]', event.threadID, event.messageID);
  }

  const text = args.slice(2).join(" ");
  const secretKey = 'mySecretKey';

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
