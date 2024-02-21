module.exports.config = {
  name: 'autoseen',
  version: '69'
}

module.exports.handleEvent = async function ({ api, event }) {
if (event.body !== null) {
          api.markAsReadAll(() => { });
        }
}