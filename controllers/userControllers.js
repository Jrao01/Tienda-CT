const User = require('../models/users');
// Definición de los modelos
const Producto = require('../models/productos');
const Categoria = require('../models/categorias');
const jwt = require('jsonwebtoken');
const Cookies = require('js-cookie');
const { getBCV, getPARALEL } = require('../utils/scrapingBCV');
const Sequelize = require('sequelize');

let NewPayload
let accessToken
let BCV
let PARALEL

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
        BCV = getBCV();
        PARALEL = getPARALEL();

        res.render('inicio', { categorias, productos, BCV, PARALEL });
        console.log('Entrando a ver productos {coding JAR}');
        console.log(`precio bcv: ${BCV}`);
        console.log(`categorias: ${categorias}`);
        /*
        const cook = Cookies.get('prueba')
        console.log(cook)*/
    } catch (error) {
        console.error(error);
        res.status(500).send('error obteniendo productos');
    }
};

const userGetProductos = async (req, res) => {
    try {

        const codedData = req.cookies['accessToken'];
        console.log('-------------------------------');
        console.log('-------------------------------');
        console.log(codedData);
        console.log('-------------------------------');
        console.log('-------------------------------');
        const userData = jwt.verify(codedData, process.env.SECRETKEY);
        const DoneWL = userData.WhishList
        const Basket = userData.Basket
        console.log('User`s whislist : ', DoneWL)
        const prodId = req.params.id
        const prod = await Producto.findOne({
            where: { id: prodId },
            include: [{
                model: Categoria,
                as: 'category'
            }]
        });

        //console.log(prod)

        const related = prod.categoria
        //console.log(related)
        const title = prod.nombre

        const prods = await Producto.findAll({
            where: { categoria: related },
            include: [{
                model: Categoria,
                as: 'category'
            }]
        });

        /*console.log('----------------');
        console.log(prods);
        console.log('----------------');*/
        BCV = getBCV();
        PARALEL = getPARALEL();

        res.render('producto', { prods, prod, title, BCV, PARALEL, DoneWL, Basket })
    } catch (error) {
        console.error(error);
        res.status(500).send('error obteniendo productos');
    }
}


const getWhishlist = async (req, res) => {
    try {

        const Ruid = req.cookies['accessToken']
        const Duid = jwt.verify(Ruid, process.env.SECRETKEY)
        const Uid = Duid.id

        const Prods = await Producto.findAll({
            where: { status: 'habilitado' },
            include: [{
                model: Categoria,
                as: 'category'
            }]
        })
        const RWP = await User.findOne({ where: { id: Uid } })
        const WP = RWP.WhishList

        res.render('WhishList', { WP, Prods, BCV })
    } catch (error) {
        console.error(error);
        res.status(500).send('error obteniendo productos');
    }
};



const getCarrito = async (req, res) => {
    try {
        
        const Ruid = req.cookies['accessToken']
        const Duid = jwt.verify(Ruid, process.env.SECRETKEY)
        const Uid = Duid.id

        const Prods = await Producto.findAll({
            where: { status: 'habilitado' },
            include: [{
                model: Categoria,
                as: 'category'
            }]
        })
        const user = await User.findOne({ where: { id: Uid } })

        /*let id = user.id;
        let nombre = user.nombre;
        let correo = user.correo;*/
        let WhishList = user.WhishList;
        let Basket = user.Basket;
        let title = 'carrito de compras'
        let BCV = getBCV()
        res.render('carrito',{WhishList,Basket,Prods,title,BCV})

    } catch (error){
        console.error(error);
        res.status(500).send('error obteniendo productos');
}}


// --------------------------- posts ------------------------------------//


const dataPost = async (req, res) => {

    try {

        const { email, password } = req.body
        console.log(email, password)
        //    datos del usuario
        const rawData = await User.findOne({ where: { correo: email, contrasena: password } })


        let id = rawData.id;
        let nombre = rawData.nombre;
        let correo = rawData.correo;
        let WhishList = rawData.WhishList;
        let Basket = rawData.Basket;

        const Payload = { id, nombre, correo, WhishList, Basket }

        console.log('--------------------------------------------------')
        console.log('payload: ', Payload)
        console.log('--------------------------------------------------')

        accessToken = await generateAccesToken(Payload);
        console.log('--------------------------------------------------')
        console.log(accessToken)
        console.log('--------------------------------------------------')
        res.cookie('accessToken', accessToken, { expires: new Date(Date.now() + 3600000), httpOnly: false }).redirect('/inicio')

    } catch (error) {
        console.log(error);
        return res.redirect('/')
    }
}


const addUserPost = async (req, res) => {
    try {
        const { nombre, email, contrasena } = req.body;
        await User.create({ nombre, correo: email, contrasena });
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send('error en el servidor');
    }
};



const addToWhish = async (req, res) => {

    try {

        const codedID = req.cookies['accessToken'];
        //console.log(codedID);  
        const decodedInfo = jwt.verify(codedID, process.env.SECRETKEY);
        const Uid = decodedInfo.id;
        console.log('uid  ', Uid);
        const idp = req.params.id;
        console.log('idp  ', idp);

        await User.update({
            WhishList: Sequelize.fn('array_append', Sequelize.col('WhishList'), idp)
        }, {
            where: { id: Uid }
        });

        const user = await User.findOne({ where: { id: Uid } })

        console.log('----------///----///----///----///----///----///----///----');
        console.log(user)
        console.log('----------///----///----///----///----///----///----///----');

        let id = user.id;
        let nombre = user.nombre;
        let correo = user.correo;
        let WhishList = user.WhishList;
        let Basket = user.Basket;

        NewPayload = { id, nombre, correo, WhishList, Basket };

        const NewToken = await generateAccesToken(NewPayload);


        console.log(req.get("Referrer"))

        res.cookie('accessToken', '', {
            expires: new Date(Date.now() - 3600000), // Set expires date to 15 minutes ago
            httpOnly: false
        }).

            cookie('accessToken', NewToken, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: false
            }).redirect(req.get("Referrer"));

    } catch (error) {
        console.log(error);
        res.status(500).send('error agregando a lista de deseos');
    }

}

const removeFromWhish = async (req, res) => {

    try {
        const idp = req.params.id;
        const tkn = req.cookies['accessToken'];

        const decodedtkn = jwt.verify(tkn, process.env.SECRETKEY)

        let uid = decodedtkn.id;
        console.log('--------------------------------------------------------')
        console.log(uid)
        console.log('--------------------------------------------------------')

        await User.update({
            WhishList: Sequelize.fn('array_remove', Sequelize.col('WhishList'), idp)
        }, {
            where: { id: uid }
        });

        const user = await User.findOne({ where: { id: uid } })

        let id = user.id;
        let nombre = user.nombre;
        let correo = user.correo;
        let WhishList = user.WhishList;
        let Basket = user.Basket;

        NewPayload = { id, nombre, correo, WhishList, Basket };

        console.log('------------NewPayload-WLRemoved---------------')
        console.log('------------NewPayload-WLRemoved---------------')
        console.log(NewPayload)
        console.log('------------NewPayload-WLRemoved---------------')
        console.log('------------NewPayload-WLRemoved---------------')

        NewToken = await generateAccesToken(NewPayload);


        console.log('------------NewToken-WLRemoved---------------')
        console.log('------------NewToken-WLRemoved---------------')
        console.log(NewToken)
        console.log('------------NewToken-WLRemoved---------------')
        console.log('------------NewToken-WLRemoved---------------')


        res.cookie('accessToken', '', {
            expires: new Date(Date.now() - 3600000),
            httpOnly: false
        }).cookie('accessToken', NewToken, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: false
        }).redirect(req.get("Referrer"));

    } catch (error) {
        console.error(error);
        res.status(500).send('error eliminando de lista de deseos')
    }
}

const addToBasket = async (req, res) => {
    try {
        const codedID = req.cookies['accessToken'];
        //console.log(codedID);  
        const decodedInfo = jwt.verify(codedID, process.env.SECRETKEY);
        const Uid = decodedInfo.id;
        console.log('uid  ', Uid);

        const idp = req.params.id;
        console.log('idp  ', idp);
        const { cant } = req.body
        console.log('cant ', cant);

        const Wprod = {
            id: idp,
            cantidad: cant
        }

        

        await User.update({
            Basket: Sequelize.fn('array_append', Sequelize.col('Basket'), Sequelize.literal(`'${JSON.stringify(Wprod)}'`))
        }, {
            where: {
                id: Uid
            }
        });

        const user = await User.findOne({ where: { id: Uid } })

        let id = user.id;
        let nombre = user.nombre;
        let correo = user.correo;
        let WhishList = user.WhishList;
        let Basket = user.Basket;

        console.log('inicio//  carrito de compras>>>')
        console.log('-----------')
        Basket.forEach(item=>{
            console.log('id: ',item.id)
            console.log('cantidad: ',item.cantidad)
            console.log('-----------')
        })
        console.log('fin//  carrito de compras>>>')
        
        NewPayload = { id, nombre, correo, WhishList, Basket };

        NewToken = await generateAccesToken(NewPayload);


        res.cookie('accessToken', '', {
            expires: new Date(Date.now() - 3600000),
            httpOnly: false
        }).cookie('accessToken', NewToken, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: false
        }).redirect(req.get("Referrer"));

    } catch (error) {
        console.log(error);
        res.status(500).send('error agregando al carrito')
    }

};


const removeFromBasket = async (req,res)=>{

    try{
        const idp = req.params.id;
        const cant = req.params.cant;
        const tkn = req.cookies['accessToken'];

        const decodedtkn = jwt.verify(tkn, process.env.SECRETKEY)

        let uid = decodedtkn.id;
        console.log('--------------------------------------------------------')
        console.log(uid)
        console.log('--------------------------------------------------------')

        const Bp = {
            id: idp,
            cantidad : cant
        }

        console.log(`bp : ${Bp}`)

        await User.update({
            Basket: Sequelize.fn('array_remove', Sequelize.col('Basket'),Sequelize.literal(`'${JSON.stringify(Bp)}'`))
        }, {
            where: { id: uid }
        });

        const user = await User.findOne({ where: { id: uid } })

        let id = user.id;
        let nombre = user.nombre;
        let correo = user.correo;
        let WhishList = user.WhishList;
        let Basket = user.Basket;

        console.log('inicio//  carrito de compras>>>')
        console.log('-----------')
        Basket.forEach(item=>{
            console.log('id: ',item.id)
            console.log('cantidad: ',item.cantidad)
            console.log('-----------')
        })
        console.log('fin//  carrito de compras>>>')
        
        NewPayload = { id, nombre, correo, WhishList, Basket };

        NewToken = await generateAccesToken(NewPayload);

        res.cookie('accessToken', '', {
            expires: new Date(Date.now() - 3600000),
            httpOnly: false
        }).cookie('accessToken', NewToken, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: false
        }).redirect(req.get("Referrer"));

    }catch(error){
        console.log(error);
        res.status(500).send('error eliminando producto del carrito')
    }

}






async function generateAccesToken(UserData) {
    try {
        const accessToken = jwt.sign(UserData, process.env.SECRETKEY, { expiresIn: '1h' });
        return accessToken
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating access token');
    }
}

module.exports = {
    getProductos,
    userGetProductos,
    getWhishlist,
    getCarrito,
    removeFromWhish,
    addUserPost,
    dataPost,
    addToWhish,
    addToBasket,
    removeFromBasket
};