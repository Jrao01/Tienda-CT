const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                nombre: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                WhishList: {
                    type: DataTypes.ARRAY(DataTypes.INTEGER),
                    defaultValue: [0],
                },
                Basket: {
                    type: DataTypes.ARRAY(DataTypes.JSONB),
                    defaultValue: [{"id": "0","nombre":"" ,"cantidad": "0", "precio":"0"}], 
                },
                tel: {
                    type: DataTypes.STRING,
                    allowNull: false, 
                },
                correo: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                contrasena: {
                    type: DataTypes.STRING,
                    allowNull: false,
                }
            },
            {
                sequelize,
                tableName: 'usuarios',
            }
        );
    }
}

User.init(sequelize, DataTypes);

module.exports = User;