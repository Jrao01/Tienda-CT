const Producto = require('../models/productos');
const Categoria = require('../models/categorias');
const User = require('../models/users');
const path = require('path');
const { error } = require('console');
const { where } = require('sequelize');

//--------------------------------


//--------------------------------



// --------------------------- gets ------------------------------------ //


const getUsers = async (req, res) => {

    try {
        const users = await User.findAll();
        res.render('admin/verUsers', { users })
        console.log('  entrando a ver todos los usuarios')

    } catch (error) {
        console.error(error);
        res.status(500).send('error obteniendo categorias');
    }

}


const getCategorias = async (req, res) => {

    try {
        const categorias = await Categoria.findAll();
        res.render('admin/verCate', { categorias })
        console.log('  entrando a la pagina ver categorias ', { categorias })

    } catch (error) {
        console.error(error);
        res.status(500).send('error obteniendo categorias');
    }

}

const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            include: [
                {
                    model: Categoria,
                    as: 'category'
                }
            ]
        });
        res.render('admin/verProductos', { productos });
        console.log('Entrando a la página ver productos', { productos });
    } catch (error) {
        console.error(error);
        res.status(500).send('error obteniendo productos');
    }
};

// --------------------------- edit gets ------------------------------------ //


const getUsersEdit = async (req, res) => {

    try {
        const userID = req.params.id

        const user = await User.findOne({ where: { id: userID } });
        res.render('admin/editarUser', { user })
    } catch (error) {
        console.error(error);
        res.status(500).send('error obteniendo usuario');
    }

}


const getProductosEdit = async (req, res) => {
    try {

        const prodId = req.params.id;
        const cate = await Categoria.findAll()
        
        const prod = await Producto.findOne({
            where: {
                id: prodId
            }
            ,
            include: [
                {
                    model: Categoria,
                    as: 'category'
                }
            ]
        });
        res.render('admin/editarProd', { prod, cate });
        console.log('Entrando a editar productos', { prod });
    } catch (error) {
        console.error(error);
        res.status(500).send('error obteniendo productos');
    }
};

// --------------------------- add gets ------------------------------------ //

const addCate = async (req, res) => {

    try {

        res.render('admin/agregarCate');

    } catch (error) {
        console.error(error);
        res.status(500).send('error obteniendo categorias');
    }
}


const addProd = async (req, res) => {

    try {
        const cate = await Categoria.findAll()
        res.render('admin/agregarProd', { cate });

    } catch (error) {
        console.error(error);
        res.status(500).send('error obteniendo categorias');
    }
}



// --------------------------- Updates ------------------------------------//



const userUpdate = async (req, res) => {

    try {
        const userID = req.params.id;
        const { nombre, correo, contrasena } = req.body;
        //------------------------------------------------------------------//
        const userData = {
            nombre,
            correo,
            contrasena
        }

        await User.update(userData, { where: { id: userID } });
        res.redirect('/admin/verUsers')
    } catch (error) {
        console.error(error);
        res.status(500).send('error al actualizar usuario');
    }

}


const prodUpdate = async (req, res) => {

    try {
        if (req.file && req.file.filename) {
            const prodID = req.params.id;
            const imagen = `/uploads/${req.file.filename}`;
            const { nombre, precio, descripcion, unidades, categoria } = req.body
            //------------------------------------------------------------------//
            const prodData = {
                nombre,precio,descripcion,
                unidades,categoria,imagen
            }
            await Producto.update(prodData, { where: { id: prodID } });
            res.redirect('/admin/verProductos')
        } else {
            console.log('no se consigue el file');
            throw error
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('error al actualizar producto');
    }

}


const disableProd = async (req,res)=>{
    try{
        const prodID = req.params.id;
        const status = {status: 'deshabilitado'};
        await Producto.update(status, { where: { id: prodID } });
        res.redirect('/admin/verProductos')
    }catch(error){
        console.error(error)
        res.status(500).send('error al deshabilitar producto')
    }
}


const EnableProd = async (req,res)=>{
    try{
        const prodID = req.params.id;
        const status = {status: 'habilitado'};
        await Producto.update(status, { where: { id: prodID } });
        res.redirect('/admin/verProductos')
    }catch(error){
        console.error(error)
        res.status(500).send('error al deshabilitar producto')
    }
}




// --------------------------- posts/create ------------------------------------//


const addProdPost = async (req, res) => {
    try {
        console.log(req.file)
        if (req.file && req.file.filename) {

            const file = `/uploads/${req.file.filename}`;
            const { nombre, precio, descripcion, unidades, categoria } = req.body
            console.log(req.file);
            await Producto.create({ nombre, precio, imagen: file, descripcion, Unidades: unidades, categoria });
            res.redirect('/admin/verProductos');
        } else {
            console.log('no se consigue el file');
            throw error

        }
    } catch (error) {
        console.error(error);
        res.status(500).send('error al agregar producto')
    }
}


const addCatePost = async (req, res) => {
    try {

        const { categoria } = req.body
        await Categoria.create({ categoria })
        res.redirect('/admin/verCate');
    } catch (error) {
        console.error(error);
        res.status(500).send('error al agregar producto')
    }
}


module.exports = {

    //   gets   //

    getProductos,
    getCategorias,
    getUsers,

    // edits gets //

    getUsersEdit,
    getProductosEdit,


    // adds gets // 

    addProd,
    addCate,

    //   updates   //

    prodUpdate,
    userUpdate,
    //-//-//-//-//-//-//

    disableProd,
    EnableProd,

    //   posts/create   //

    addProdPost,
    addCatePost

};