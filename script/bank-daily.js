const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");

module.exports.config = {
  name: "daily",
  version: "1.0.0",
  info: "Get your daily allowance",
  type: "currency",
  aliases: ["daily", "allowance", "daily-allowance", "reward", "income", "claim", "earn", "sweldo"],
};

module.exports.run = async function ({ api, event, Currencies }) {
  try {
    const { threadID, senderID } = event;

    const resolve = path.resolve(__dirname, 'currency');
    const systemFolderPath = path.join(resolve);
    if (!fs.existsSync(systemFolderPath)) {
      fs.mkdirSync(systemFolderPath);
    }

    const userDataPath = path.join(systemFolderPath, `${senderID}.json`);
    const initialData = {
      lastClaimTimestamp: 0,
      dailyAllowance: 1500,
      cooldownHours: 24, 
    };

    let userCurrenciesData;
    if (!fs.existsSync(userDataPath)) {
      // If the JSON file doesn't exist, create it with initial data
      fs.writeFileSync(userDataPath, JSON.stringify(initialData, null, 2));
      userCurrenciesData = initialData;
    } else {
      // If the JSON file exists, read its contents
      const userDataContent = fs.readFileSync(userDataPath, 'utf8');
      userCurrenciesData = JSON.parse(userDataContent);
    }

    const lastClaimTimestamp = userCurrenciesData.lastClaimTimestamp || 0;
    const currentTime = DateTime.now().toMillis();
    const timeSinceLastClaim = currentTime - lastClaimTimestamp;
    const cooldown = (userCurrenciesData.cooldownHours || 24) * 60 * 60 * 1000;

    if (timeSinceLastClaim < cooldown) {
      const remainingTime = cooldown - timeSinceLastClaim;
      const remainingHours = Math.ceil(remainingTime / (60 * 60 * 1000));
      api.sendMessage(`⏰ | You already claimed your daily allowance. Please comeback tommorow!`, threadID);
      return;
    }

    await Currencies.increaseMoney(senderID, userCurrenciesData.dailyAllowance);

    userCurrenciesData.lastClaimTimestamp = currentTime;

    fs.writeFileSync(userDataPath, JSON.stringify(userCurrenciesData, null, 2));

    const updatedUserData = await Currencies.getData(senderID);
    const totalBalance = updatedUserData.money || 0;

    api.sendMessage(`💰 | You claimed your daily allowance of $${userCurrenciesData.dailyAllowance.toLocaleString()}.\nYour total balance is now $${totalBalance.toLocaleString()} credits.`, threadID);
  } catch (error) {
    console.error("Error in daily allowance command:", error);
  }
};
