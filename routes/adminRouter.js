const express = require('express');
const router = express.Router();
const upload = require('../utils/multer.js');
const path = require('path');


const {
    addProdPost, getProductos, getCategorias,
    addCatePost, addCate, addProd, getUsers,
    getUsersEdit,userUpdate,getProductosEdit,
    prodUpdate, disableProd, EnableProd,
    } = require('../controllers/adminControllers');


// ------------------------------ gets ------------------------------------- //

router.get( '/admin/verCate', getCategorias);
router.get( '/admin/verProductos', getProductos );
router.get( '/admin/verUsers', getUsers );

// --------------------------- Edit gets ------------------------------------ //

router.get( '/admin/editarUser/:id', getUsersEdit );
router.get( '/admin/editarProd/:id', getProductosEdit );


// --------------------------- Add gets ------------------------------------- //

router.get( '/admin/agregarCate', addCate);
router.get( '/admin/agregarProd', addProd);

// --------------------------- updates ---------------------------------------- //

router.post('/userUpdate/:id', userUpdate);
router.post('/prodUpdate/:id', prodUpdate);

                // ------------------------------- //

router.get('/admin/disableProd/:id', disableProd);
router.get('/admin/enableProd/:id', EnableProd);

// --------------------------- Posts ---------------------------------------- //

router.post('/addProd',upload.single('imagen') ,addProdPost );
router.post('/addCate', addCatePost);


////////////////////////////////////////////////////////////////////////

module.exports = router;