const env = {
    database: 'node_web_app_db',
    username: 'root',
    password: '123456',
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
  };
   
  module.exports = env;