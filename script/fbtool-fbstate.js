const axios = require("axios");

module.exports.config = {
  name: 'fbstate',
  version: 'v0.1-alpha',
  role: 0,
  credits: 'Kenneth Panio',
  aliases: ['appstate', 'c3c', 'c3cfbstate'],
  info: 'get appstate or convert using token',
  type: 'fbtool',
  usage: '[email/uid/number] [password]',
  cd: 8,
}

module.exports.run = async function (args, event, api) {
  const { threadID, messageID, senderID } = event;

  const emailOrUID = args[0];
  const password = args.slice(1).join(' ');

  if (!emailOrUID || !password) {
    api.sendMessage('Please provide email/UID and password!', threadID, messageID);
    return;
  }

  try {
    // Logging in to get a session token
    const loginRes = await axios({
      url: 'https://api.facebook.com/method/auth.login',
      method: "GET",
      params: {
        email: emailOrUID,
        password: password,
        format: "json"
      }
    });

    const sessionToken = loginRes.data.session_key;

    // Getting app state using the session token
    const appStateRes = await axios({
      url: 'https://graph.facebook.com/app',
      method: "GET",
      params: {
        access_token: sessionToken
      }
    });

    if (appStateRes.data.error)
      throw new Error("Unable to get app state");

    // Getting session cookies using the session token and app ID
    const sessionCookiesRes = await axios({
      url: 'https://api.facebook.com/method/auth.getSessionforApp',
      method: "GET",
      params: {
        access_token: sessionToken,
        format: "json",
        new_app_id: appStateRes.data.id,
        generate_session_cookies: '1'
      }
    });

    if (sessionCookiesRes.data.error_code)
      throw new Error("Unable to get session cookies");
    else if (sessionCookiesRes.data.session_cookies?.length >= 0) {
      const sessionCookies = sessionCookiesRes.data.session_cookies.map(x => {
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
