const express = require('express');
const router = express.Router();
const{ addUserPost, getProductos, userGetProductos , getCarrito, removeFromBasket ,getWhishlist , removeFromWhish ,dataPost, addToWhish,addToBasket } = require('../controllers/userControllers');
const validateToken = require('../middlewares/verify.js');



router.get('/index',(req,res)=>{
    res.render('index', {title:'Login', fail:true})}); 

router.get('/',(req,res)=>{
    res.render('index', {title:'Login', fail:false});
}); 

router.get('/registro', (req,res)=>{
    res.render('registro', {title:'Registro'});
}); 

router.get('/WhishList', getWhishlist);
router.get('/carrito', getCarrito);
router.get('/producto/:id', userGetProductos)
router.get('/inicio', validateToken, getProductos);


// --------------------------- Posts ---------------------------------------- //


router.post('/sendData', dataPost);
router.post('/createUser', addUserPost );

router.post('/addToWhishList/:id', addToWhish);
router.post('/removeFromWhishList/:id', removeFromWhish);
router.post('/addToBasket/:id', addToBasket);
router.post('/removeFromBasket/:id/:cant', removeFromBasket);


module.exports = router;