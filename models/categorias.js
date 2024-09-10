const {Model, DataTypes} = require('sequelize');

const sequelize = require('../config/database');

class Categoria extends Model{
    static init(sequelize,DataTypes){
        return super.init(
            {
                id:{
                    type:DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true
                },
                categoria:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                }
            },{
                sequelize,
                tableName : 'categorias'
            }
        )
    }
}

Categoria.init(sequelize,DataTypes);

module.exports = Categoria;