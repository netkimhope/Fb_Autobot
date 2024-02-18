const CryptoJS = require('crypto-js');

module.exports.config = {
  name: "cipher++",
  version: "1.2.0",
  role: 0,
  credits: "Kenneth Panio",
  info: "Enhanced text encryption",
  type: "tools",
  usage: "[en|de]",
  cd: 0
};

module.exports.run = async ({ api, event, args }) => {
  var text = args.slice(2).join(" ");
  const allTypes = ["enc", "dec"];

  if (!args[0] || !allTypes.includes(args[0]) || !args[1] || isNaN(args[1]) || args[1] > 10 || args[1] <= 0 || !text) {
    return api.sendMessage(`${!args[0] || !allTypes.includes(args[0]) ? '» Please choose enc|dec' : !args[1] ? '» Please enter the number of iterations for en|de' : isNaN(args[1]) ? '» The number of iterations for enc|dec must be a valid number' : args[1] > 10 ? '» The number of iterations for enc|dec is too high, recommend < 10 and > 0' : !text ? '» Please enter the text you want to encrypt/decrypt' : '» :v'}`, event.threadID, event.messageID);
  }

  switch (args[0]) {
    case "enc": {
      const encryptedText = aesEncrypt(text, 'myAesSecretKey');
      const xorCipheredText = xorCipher(encryptedText, 'myXorSalt', args[1]);
      api.sendMessage(xorCipheredText, event.threadID, event.messageID);
      break;
    }
    case "dec": {
      const xorDecipheredText = xorDecipher(text, 'myXorSalt', args[1]);
      const decryptedText = aesDecrypt(xorDecipheredText, 'myAesSecretKey');
      api.sendMessage(decryptedText, event.threadID, event.messageID);
      break;
    }
  }
};

const aesEncrypt = (text, secretKey) => {
  const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
  return ciphertext;
};

const aesDecrypt = (ciphertext, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

const xorCipher = (text, salt, iterations) => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);

  for (let i = 0; i < iterations; i++) {
    text = text.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
  }

  return text;
};

const xorDecipher = (encoded, salt, iterations) => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);

  return encoded.match(/.{1,2}/g)
    .map(hex => parseInt(hex, 16))
    .map(applySaltToChar)
    .map(charCode => String.fromCharCode(charCode))
    .join('');
};
