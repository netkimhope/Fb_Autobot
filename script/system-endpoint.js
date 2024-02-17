const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");

let endpoints = {};

try {
  const endpointPath = path.resolve(__dirname, 'system', 'endpoint.json');
  endpoints = require(endpointPath);
} catch (readError) {
  console.error('Error reading endpoint.json:', readError);
}

module.exports.config = {
  name: 'endpoint',
  aliases: ['ep', 'endpoints', 'api'],
  info: 'setup endpoint for chatbot commands',
  type: "Configuration",
  version: '1.0.0',
  role: 1,
  cd: 0
};

module.exports.run = async function({ api, event, args }) {
  let { threadID, messageID } = event;
  const [operation, name, url] = args;

  switch (operation) {
    case 'add':
      if (!name || !url) {
        api.sendMessage(`Please provide a name and URL to add an endpoint.`, threadID, messageID);
        return;
      }
      const sanitizedURL = url.replace(/\(\.\)/g, '.');
      endpoints[name] = sanitizedURL;
      updateEndpointFile();
      api.sendMessage(`Endpoint "${name}" added successfully.`, threadID, messageID);
      break;

    case 'del':
      if (!name || !endpoints[name]) {
        api.sendMessage(`Please provide a valid name to delete an endpoint.`, threadID, messageID);
        return;
      }
      delete endpoints[name];
      updateEndpointFile();
      api.sendMessage(`Endpoint "${name}" deleted successfully.`, threadID, messageID);
      break;

    case 'list':
      if (name === 'all') {
        const allEndpoints = Object.entries(endpoints);
        const allListMessage = allEndpoints.map(([endpointName, endpointURL]) => `${sanitizeURL(endpointURL)}: ${endpointName}`).join('\n');
        api.sendMessage(`All Endpoints:\n${allListMessage}`, threadID, messageID);
      } else {
        const page = parseInt(name) || 1;
        const perPage = 5;
        const endpointList = Object.entries(endpoints);
        const totalPages = Math.ceil(endpointList.length / perPage);
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;

        if (page < 1 || startIndex >= endpointList.length) {
          api.sendMessage(`Invalid page number.`, threadID, messageID);
          return;
        }

        const slicedEndpoints = endpointList.slice(startIndex, endIndex);
        const listMessage = slicedEndpoints.map(([endpointName, endpointURL]) => `${sanitizeURL(endpointURL)}: ${endpointName}`).join('\n');

        api.sendMessage(`Endpoint List (Page ${page}/${totalPages}):\n${listMessage}`, threadID, messageID);
      }
      break;

    default:
      api.sendMessage(`Invalid operation. Use "add", "del", or "list".`, threadID, messageID);
  }

  function sanitizeURL(url) {
    return url.replace(/\./g, '(.)');
  }

  function updateEndpointFile() {
    const endpointPath = path.resolve(__dirname, 'system', 'endpoint.json');
    fs.writeFileSync(endpointPath, JSON.stringify(endpoints, null, 2));
  }
};
