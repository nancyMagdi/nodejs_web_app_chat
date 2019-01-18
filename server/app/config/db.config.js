const env = require('./env.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect,
    operatorsAliases: false,
    define: {
        timestamps: false
    },
    pool: {
        max: env.max,
        min: env.pool.min,
        acquire: env.pool.acquire,
        idle: env.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../model/users.js')(sequelize, Sequelize);
db.contactList = require('../model/contacts_list.js')(sequelize, Sequelize);
db.chatHistory = require('../model/chats_history.js')(sequelize, Sequelize);
db.chatThread = require('../model/chat_threads.js')(sequelize, Sequelize);

// adding relations 
db.chatHistory.belongsTo(db.chatThread, {foreignKey: 'ChatThreadId'});
db.contactList.belongsTo(db.user, {foreignKey: 'FirstUserId'});
db.contactList.belongsTo(db.user, {foreignKey: 'SecondUserId'});

db.chatThread.belongsTo(db.user, {foreignKey: 'FirstUserId'});
db.chatThread.belongsTo(db.user, {foreignKey: 'SecondUserId'});

db.chatHistory.belongsTo(db.user, {foreignKey: 'SenderUserId'});
db.chatHistory.belongsTo(db.user, {foreignKey: 'ReciverUserId'});

module.exports = db;