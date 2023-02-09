const { DataTypes } = require('sequelize');

module.exports = pmodel;

function pmodel(sequelize) {
    const attributes = {
        name:{ type: DataTypes.STRING, allowNull: false },
        description:{ type: DataTypes.STRING, allowNull: false },
        sku: { type: DataTypes.STRING, allowNull: false },
        manufacturer: { type: DataTypes.STRING, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        date_added:{
            type: DataTypes.STRING,
            allowNull: false
          },
          date_last_updated:{
            type: DataTypes.STRING,
            allowNull: false
          },
        owner_user_id: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        scopes: {
            withPassword: { attributes: {}, }
        }
    };
    return sequelize.define('Product', attributes, options);
}