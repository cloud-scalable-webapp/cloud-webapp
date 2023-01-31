const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        first_name:{ type: DataTypes.STRING, allowNull: false },
        last_name:{ type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        account_created:{
            type: DataTypes.STRING,
            allowNull: false
          },
          account_updated:{
            type: DataTypes.STRING,
            allowNull: false
          }
    };

    const options = {
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        scopes: {
            withPassword: { attributes: {}, }
        }
    };
    return sequelize.define('Users', attributes, options);
}