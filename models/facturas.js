const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/database');

class Facturas extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id:{
                    type : DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey : true
                },
                factura:{
                    type:DataTypes.ARRAY(DataTypes.JSONB),
                    allowNull : false
                },
                userId:{
                    type: DataTypes.INTEGER
                }
            },
            {
                sequelize,
                tableName: 'facturas'
            }
        )
    }
};
Facturas.init(sequelize, DataTypes);

module.exports = Facturas;