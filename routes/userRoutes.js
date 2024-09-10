const express = require('express');
const router = express.Router();
const{ addUserPost, getProductos,dataPost } = require('../controllers/userControllers');
const validateToken = require('../middlewares/verify.js');


router.get('/',(req,res)=>{
    console.log("hello")
    res.render('index', {title:'Login'});

}); 



router.get('/registro', (req,res)=>{
    console.log("hello")
    res.render('registro', {title:'Registro'});

}); 

router.get('/carrito',(req,res)=>{
    console.log('accediendo al carrito de compras');
    res.render('carrito',{title:"Tu Carrito de Compras"})
})


////


router.get('/inicio', validateToken, getProductos);


// --------------------------- Posts ---------------------------------------- //


router.post('/sendData', dataPost)
router.post('/createUser', addUserPost )


module.exports = router;