/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  const User = sequelize.define('users', {
    Id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FullName: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    Username: {
      type: Sequelize.STRING(200),
      allowNull: false,
      unique: true
    },
    Password: {
      type: Sequelize.STRING(150),
      allowNull: false
    },
    Image: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    Status: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
      defaultValue: '0'
    },
    LastLoginTime: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, {
    tableName: 'users'
  });
  return User;
};
