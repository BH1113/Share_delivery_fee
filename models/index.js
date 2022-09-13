const Sequelize = require('sequelize');
const User = require('./user');
const Food = require('./food');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config, 
);

db.sequelize = sequelize;
db.User = User;
db.Food = Food;

User.init(sequelize);
Food.init(sequelize);

User.associate(db);
Food.associate(db);

module.exports = db;