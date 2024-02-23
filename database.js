const fs = require('fs');

function createConfig() {
  const config = [{
    masterKey: {
      admin: ["61550873742628", "100081201591674"],
      devMode: false,
      database: false,
      restartTime: 15,
    },
    fcaOption: {
      forceLogin: true,
      listenEvents: true,
      logLevel: "silent",
      updatePresence: true,
      selfListen: false,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64",
      online: true,
      autoMarkDelivery: false,
      autoMarkRead: false
    }
  }];
  const dataFolder = './data';
  if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);
  fs.writeFileSync('./data/config.json', JSON.stringify(config, null, 2));
  return config;
}
async function createThread(threadID, api) {
  try {
    const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
    const threadInfo = await api.getThreadInfo(threadID);
    const Threads = database.findIndex(Thread => Thread.Threads);
    const Users = database.findIndex(User => User.Users);
    if (Threads !== -1) {
      database[Threads].Threads[threadID] = {
        threadName: threadInfo.threadName,
        participantIDs: threadInfo.participantIDs,
        adminIDs: threadInfo.adminIDs
      };
    } else {
      const Threads = threadInfo.isGroup ? {
        [threadID]: {
          threadName: threadInfo.threadName,
          participantIDs: threadInfo.participantIDs,
          adminIDs: threadInfo.adminIDs
        }
      } : {};
      database.push({
        Threads: {
          Threads
        }
      });
    }
    if (Users !== -1) {
      threadInfo.userInfo.forEach(userInfo => {
        const Thread = database[Users].Users.some(user => user.id === userInfo.id);
        if (!Thread) {
          database[Users].Users.push({
            id: userInfo.id,
            name: userInfo.name,
            money: 0,
            exp: 0,
            level: 1
          });
        }
      });
    } else {
      const Users = threadInfo.isGroup ? threadInfo.userInfo.map(userInfo => ({
        id: userInfo.id,
        name: userInfo.name,
        money: 0,
        exp: 0,
        level: 1
      })) : [];
      database.push({
        Users
      });
    }
    await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2), 'utf-8');
    return database;
  } catch (error) {
    console.log(error);
  }
}
async function createDatabase() {
  const data = './data';
  const database = './data/database.json';
  if (!fs.existsSync(data)) {
    fs.mkdirSync(data, {
      recursive: true
    });
  }
  if (!fs.existsSync(database)) {
    fs.writeFileSync(database, JSON.stringify([]));
  }
  return database;
}
async function updateThread(id) {
  const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
  const user = database[1]?.Users.find(user => user.id === id);
  if (!user) {
    return;
  }
  user.exp += 1;
  await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2));
}