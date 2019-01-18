module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        FullName: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true 
        },
        Username: {
            type: Sequelize.STRING,
            unique: true ,
            allowNull: false
        },
        Password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Image:{
            type: Sequelize.STRING,
            allowNull: true
        },
        LastLoginTime:{
            type: Sequelize.DATE,
            allowNull: true
        }
    });

    return User;
}