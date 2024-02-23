const fs = require('fs');
const path = require('path');
const script = path.join(__dirname, 'script');

const config = fs.existsSync('./data') && fs.existsSync('./data/config.json') ? JSON.parse(fs.readFileSync('./data/config.json', 'utf8')) : createConfig();

const Utils = new Object({
  commands: new Map(),
  handleEvent: new Map(),
  account: new Map(),
   cds: new Map(),
  ObjectReply: new Map(),
  handleReply: [],
});

fs.readdirSync(script).forEach((file) => {
  const scripts = path.join(script, file);
  const stats = fs.statSync(scripts);

  if (stats.isDirectory()) {
    fs.readdirSync(scripts).forEach((file) => {
      const filePath = path.join(scripts, file);

      if (path.extname(filePath).toLowerCase() === '.js') {
        try {
          const {
            config,
            run,
            handleEvent,
            handleReply
          } = require(filePath);

          if (config) {
            const {
              name = [], role = '0', version = '1.0.0', hasPrefix = true, aliases = [], info = '', usage = '', credits = '',  cd = '5'
            } = Object.fromEntries(Object.entries(config).map(([key, value]) => [key.toLowerCase(), value]));

            aliases.push(name);

            if (run) {
              Utils.commands.set(aliases, {
                name,
                role,
                run,
                aliases,
                info,
                usage,
                version,
                hasPrefix: config.hasPrefix,
                credits,
                cd
              });
            }

            if (handleEvent) {
              Utils.handleEvent.set(aliases, {
                name,
                handleEvent,
                role,
                info,
                usage,
                version,
                hasPrefix: config.hasPrefix,
                credits,
                cd
              });
            }

            if (handleReply) {
              Utils.ObjectReply.set(aliases, {
                name,
                handleReply,
              });
            }
          }
        } catch (error) {
          console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
        }
      }
    });
  } else if (path.extname(scripts).toLowerCase() === '.js') {
    try {
      const {
        config,
        run,
        handleEvent,
        handleReply
      } = require(scripts);

      if (config) {
        const {
          name = [], role = '0', version = '1.0.0', hasPrefix = true, aliases = [], info = '', usage = '', credits = '',  cd = '5'
        } = Object.fromEntries(Object.entries(config).map(([key, value]) => [key.toLowerCase(), value]));

        aliases.push(name);

        if (run) {
          Utils.commands.set(aliases, {
            name,
            role,
            run,
            aliases,
            info,
            usage,
            version,
            hasPrefix: config.hasPrefix,
            credits,
            cd
          });
        }

        if (handleEvent) {
          Utils.handleEvent.set(aliases, {
            name,
            handleEvent,
            role,
            info,
            usage,
            version,
            hasPrefix: config.hasPrefix,
            credits,
            cd
          });
        }

        if (handleReply) {
          Utils.ObjectReply.set(aliases, {
            name,
            handleReply,
          });
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
    }
  }
});

const Experience = {
  async levelInfo(id) {
    const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
    const data = database[1].Users.find(user => user.id === id);
    if (!data) {
      return;
    }
    return data;
  },
  async levelUp(id) {
    const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
    const data = database[1].Users.find(user => user.id === id);
    if (!data) {
      return;
    }
    data.level += 1;
    await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2), 'utf-8');
    return data;
  }
}

const Currencies = {
  async update(id, money) {
    try {
      const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
      const data = database[1].Users.find(user => user.id === id);
      if (!data || !money) {
        return;
      }
      data.money += money;
      await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2), 'utf-8');
      return data;
    } catch (error) {
      console.error('Error updating Currencies:', error);
    }
  },
  async increaseMoney(id, money) {
    try {
      const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
      const data = database[1].Users.find(user => user.id === id);
      if (!data) {
        return;
      }
      if (data && typeof data.money === 'number' && typeof money === 'number') {
        data.money += money;
      }
      await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2), 'utf-8');
      return data;
    } catch (error) {
      console.error('Error checking Currencies:', error);
    }
  },
  async decreaseMoney(id, money) {
    try {
      const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
      const data = database[1].Users.find(user => user.id === id);
      if (!data) {
        return;
      }
      if (data && typeof data.money === 'number' && typeof money === 'number') {
        data.money -= money;
      }
      await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2), 'utf-8');
      return data;
    } catch (error) {
      console.error('Error checking Currencies:', error);
    }
  },
  async getData(id) {
    try {
      const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
      const data = database[1].Users.find(user => user.id === id);
      if (!data) {
        return;
      }
      return data;
    } catch (error) {
      console.error('Error checking Currencies:', error);
    }
  }
};