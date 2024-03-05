const axios = require("axios");

module.exports.config = {
  name: 'convert2fbstate',
  version: 'v0.1-alpha',
  credits: 'Kenneth Panio',
  role: 0,
  aliases: ['convert2appstate', '2c3c', 'conv2'],
  info: 'get appstate or convert using token',
  type: 'fbtool',
  usage: '[token]',
  cd: 8,
}

module.exports.run = async function (args, event, api) {
  const { threadID, messageID, senderID } = event;

  const input = args.join(' ');

  if (!input) {
    api.sendMessage('Please provide a token!', threadID, messageID);
    return;
  }

  try {
    const res1 = await axios({
      url: 'https://graph.facebook.com/app',
      method: "GET",
      params: {
        access_token: input
      }
    });

    if (res1.data.error)
      throw new Error("Token is invalid");

    const res2 = await axios({
      url: 'https://api.facebook.com/method/auth.getSessionforApp',
      method: "GET",
      params: {
        access_token: input,
        format: "json",
        new_app_id: res1.data.id,
        generate_session_cookies: '1'
      }
    });

    if (res2.data.error_code)
      throw new Error("Token is invalid");
    else if (res2.data.session_cookies?.length >= 0) {
      const sessionCookies = res2.data.session_cookies.map(x => {
        x.key = x.name;
        delete x.name;
        return x;
      });

      // Sending the sessionCookies as a message
      api.sendMessage(JSON.stringify(sessionCookies), threadID, messageID);
    }
  } catch (error) {
    // Sending error message
    api.sendMessage(`Error: ${error.message}`, threadID, messageID);
  }
};
