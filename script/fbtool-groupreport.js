const axios = require('axios');

module.exports.config = {
  name: "fbgroup-report",
  aliases: ["groupreport", "reportgroup", "fb-group-report", "zuck", "fuckgroup"],
  version: "1.0",
  role: 3,
  credits: "Kenneth Panio",
  info: "Report a Facebook group as spam",
  type: "tools",
  usage: "[token] [group_id] [amount]",
  cd: 6
};

module.exports.run = async ({ api, event, args }) => {
  try {
    if (args.length !== 3) {
      api.sendMessage('Invalid number of arguments. Usage: !fbgroup-report [token] [group_id] [amount]', event.threadID);
      return;
    }

    const accessToken = args[0];
    const groupId = args[1];
    const reportAmount = parseInt(args[2]);

    if (isNaN(reportAmount) || reportAmount <= 0) {
      api.sendMessage('Invalid report amount. Please provide a valid positive number.', event.threadID);
      return;
    }

    const apiVersion = 'v12.0'; 
    const timeInterval = 1500;

    let reportedCount = 0;
    let timer = null;

    async function reportGroup() {
      try {
        const response = await axios.post(
          `https://graph.facebook.com/${apiVersion}/${groupId}/reports`,
          {
            access_token: accessToken,
            report_type: 'spam',
          }
        );

        reportedCount++;
        console.log(`Group reported as spam: ${reportedCount}`);

        if (reportedCount === reportAmount) {
          clearInterval(timer);
          console.log('Finished reporting groups as spam.');
          api.sendMessage('DONE REPORTING', event.threadID);
        }
      } catch (error) {
        console.error('Failed to report group as spam:', error.response ? error.response.data : error.message);
      }
    }

    timer = setInterval(reportGroup, timeInterval);

    setTimeout(() => {
      clearInterval(timer);
      console.log('Reporting loop stopped.');
    }, reportAmount * timeInterval);
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage('An error occurred: ' + error.message, event.threadID);
  }
};
