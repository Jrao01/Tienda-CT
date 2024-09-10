const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

class Productos extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true
                },
                imagen: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                nombre: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                precio: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false
                },
                Unidades: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false 
                },
                descripcion: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                categoria: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false
                },
                status:{
                    type : DataTypes.STRING,
                    defaultValue: 'habilitado'
                }
            }, {

            sequelize,
            tableName: 'Productos'
            }
        );
    }
}



Productos.init(sequelize, DataTypes);

module.exports = Productos;