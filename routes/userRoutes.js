const express = require('express');
const router = express.Router();


router.get('/',(req,res)=>{
    console.log("hello")
    res.render('index', {title:'Login'});

}); 

router.get('/carrito',(req,res)=>{
    console.log('accediendo al carrito de compras');
    res.render('carrito',{title:"Tu Carrito de Compras"})
})

router.get('/inicio',(req,res)=>{
    console.log('Iniciando Pagina');
    res.render('inicio',{title:"Tienda JAR"})
})

module.exports = router;