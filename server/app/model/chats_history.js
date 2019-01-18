/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  return sequelize.define('chats_history', {
    Id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ChatThreadId: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    messageText: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    FromUserId: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    ToUserId: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    CreationDateTime: {
      type: Sequelize.DATE,
      allowNull: false
    },
    AttachementLocation: {
      type: Sequelize.STRING(300),
      allowNull: true
    }
  }, {
    tableName: 'chats_history'
  });
};
