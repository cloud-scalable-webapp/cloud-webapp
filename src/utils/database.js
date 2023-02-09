const config = require('../../db-config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    let sequelize;
    if(process.env.NODE_ENV === 'test') {
         sequelize = new Sequelize(database, user, password, { define: {
            timestamps: false
           },dialect: 'sqlite', "storage":":memory:", logging:false });
    }else{
        sequelize = new Sequelize(database, user, password, { define: {
            timestamps: false
           }, dialect: 'mysql', logging:false });
    }


    db.User = require('../user/user-model')(sequelize);
    db.Product = require('../product/product-model')(sequelize);
    
    await sequelize.sync();
}