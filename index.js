const cookieParser = require('cookie-parser');/// conexion 
const express = require('express');
const createError = require('http-errors');
const path = require('path')
require('dotenv').config();
const app = express();
//const {getDolarPrice} = require('./utils/scrapingBCV'); 

const logger = require('morgan');


const port = 3000;
const sequelize = require('./config/database')
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRouter');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',userRouter);
app.use('/',adminRouter);


//setInterval(getDolarPrice, 43200000 );// actualiza el precio del dolar cada 12H




sequelize
    .authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida correctamente {Coding JAR}');
        // Sincronización del modelo con la base de datos
        return sequelize.sync({ force: false });
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos {Coding JAR}:', error.message);
    });

// error handler
app.use(function (err, req, res, next) {
    
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



app.listen(port, () => {
    console.log(`servidor corriendo en el puerto ${port}`)
})
