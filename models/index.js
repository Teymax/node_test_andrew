import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_DIALECT, DB_PORT } = process.env;
const basename = path.basename(__filename);
let db = {};

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  port: DB_PORT,
  dialectOptions: {
    useUTC: false
  },
  timezone: process.env.TIMEZONE
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
