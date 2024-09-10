const Sequelize = require('sequelize');

const sequelize = new Sequelize('tiendaCT', 'CTJAR', 'Z_s_6dkl[)HhB0IU', {

    host: 'localhost',
    dialect: 'mysql'

});



module.exports = sequelize;