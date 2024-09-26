const Sequelize = require('sequelize');

const sequelize = new Sequelize('tiendaCT', 'postgres', '30336715', {

    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    
    logging: (msg) => {

        if (!msg.startsWith('Executing (default): ')) {
            console.log(msg)
        }
    },


});



module.exports = sequelize;