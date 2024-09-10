const User = require('../models/users');
// Definición de los modelos
const Producto = require('../models/productos');
const Categoria = require('../models/categorias');
const jwt = require('jsonwebtoken')
const { getBCV, getPARALEL } = require('../utils/scrapingBCV');

let accessToken

Producto.belongsTo(Categoria, { foreignKey: 'categoria', as: 'category' });
Categoria.hasMany(Producto, { foreignKey: 'categoria' });

Categoria.associate = (models) => {
    models.Categoria.hasMany(models.Producto, { foreignKey: 'categoria' });
};


// --------------------------- Gets ------------------------------------//


const getProductos = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        const productos = await Producto.findAll({
            include: [{ model: Categoria, as: 'category' }],
            where: { status: 'habilitado' }
        });
        const BCV = getBCV(); // Obtener el valor actualizado
        const PARALEL = getPARALEL(); // Obtener el valor actualizado

        res.render('inicio', { categorias, productos, BCV, PARALEL });
        console.log('Entrando a ver productos {coding JAR}');
        console.log(`precio bcv: ${BCV}`);
        console.log(`categorias: ${categorias}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('error obteniendo productos');
    }
};


// --------------------------- posts ------------------------------------//
const dataPost = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email, password)

        //    datos del usuario
        const rawData = await User.findOne({ where: { correo: email, contrasena: password } })
        const id = rawData.id
        const nombre = rawData.nombre
        const correo = rawData.correo
        const Payload = { id, nombre, correo }
        console.log('payload: ', Payload)
        console.log('--------------------------------------------------')
        if (Payload) {

            accessToken = jwt.sign(Payload, process.env.SECRETKEY, { expiresIn: '60m' }); /*generateAccesToken(Payload, res)*/
            console.log('--------------------------------------------------')
            console.log(accessToken)
            console.log('--------------------------------------------------')
            res.header('Authorization', `Bearer ${accessToken}`).redirect('/inicio')

        } else {
            console.log('usuario no encontrado')
            res.redirect('/')
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('error obteniendo usuario');
    }
}


const addUserPost = async (req, res) => {
    try {
        const { nombre, email, contrasena } = req.body;
        await User.create({ nombre, correo: email, contrasena });
        res.redirect('/inicio');
    } catch (error) {
        console.log(error);
        res.status(500).send('error en el servidor');
    }
};

async function generateAccesToken(UserData,res) {
    try {
        const accessToken = jwt.sign(UserData, process.env.SECRETKEY, { expiresIn: '60m' });
        res.set('Authorization', `Bearer ${accessToken}`);
        } catch (error) {
        console.error(error);
        res.status(500).send('Error generating access token');
    }
}

module.exports = {
    addUserPost,
    getProductos,
    dataPost
};