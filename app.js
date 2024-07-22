const cookieParser = require('cookie-parser');/// conexion 
const express = require('express');
const createError = require('http-errors');
const path = require('path')
const dotenv = require('dotenv')
const app = express();
const logger = require('morgan');


const port = 3000;
const sequelize = require('./config/database')
const indexRouter = require('./routes/userRoutes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',indexRouter);







sequelize
    .authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida correctamente {Coding JAR}');
        // Sincronización del modelo con la base de datos
        return sequelize.sync({ force: false });
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos randy:', error.message);
    });

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => {
    console.log(`servidor corriendo en el puerto ${port}`)
})