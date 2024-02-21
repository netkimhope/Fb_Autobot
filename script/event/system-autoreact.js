const axios = require('axios')

module.exports.config = {
  name: "auto-react",
  version: "69",
  credits: "Liane"
}

module.exports.handleEvent = async function ({ api, event }) {
       if (event.body !== null && event.isGroup) {
          if (Math.random() < 0.9) {
            axios.get(`https://lianeapi.onrender.com/autoreact?query=${encodeURIComponent(event.body)}`)

              .then(response => {
                const emoji = response.data.message;
                api.setMessageReaction(emoji, event.messageID, () => { }, true);
              })
              .catch(error => {
                console.error('Error fetching auto reaction:', error);
              });
          }
        }
}