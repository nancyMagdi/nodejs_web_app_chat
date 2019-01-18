/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  return sequelize.define('chat_threads', {
    Id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FirstUserId: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    SeconUserId: {
      type: Sequelize.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'chat_threads'
  });
};
