/* jshint indent: 2 */

module.exports = function (sequelize, Sequelize) {
  return sequelize.define('chats_history', {
    Id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    MessageText: {
      type: Sequelize.TEXT,
      allowNull: false
    },

    ChatThreadId: {
      type: Sequelize.BIGINT,
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
    },
    IsRead: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
      defaultValue: '0'
    }
  },
    {
      tableName: 'chats_history'
    });
};
