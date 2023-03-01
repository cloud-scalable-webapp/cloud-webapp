const { DataTypes } = require('sequelize');

module.exports = pmodel;

function pmodel(sequelize) {
    const attributes = {
       image_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        product_id:{ type: DataTypes.STRING, allowNull: false },
        file_name: { type: DataTypes.STRING, allowNull: false },
        date_created:{
            type: DataTypes.STRING,
            allowNull: false
          },
        s3_bucket_path: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        scopes: {
            withPassword: { attributes: {}, }
        }
    };
    return sequelize.define('Image', attributes, options);
}
