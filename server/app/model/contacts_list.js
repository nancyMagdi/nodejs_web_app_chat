/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  return sequelize.define('contacts_list', {
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
    SecondUserId: {
      type: Sequelize.BIGINT,
      allowNull: false
    }, 
    isConnected: {
      type: Sequelize.INTEGER(2),
      allowNull: false
    }
  }, {
    tableName: 'contacts_list'
  });
};
