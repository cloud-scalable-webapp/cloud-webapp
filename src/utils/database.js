const config = require('../../db-config');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    const { host, user, password, database, port } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password,{
        host: config.database.host,
        dialect: "mysql",
        operatorsAliases: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }, define: {
            timestamps: false
           },
      });


    db.User = require('../user/user-model')(sequelize);
    db.Product = require('../product/product-model')(sequelize);
    db.Image = require('../image/image-model')(sequelize);
    
    await sequelize.sync();
}
