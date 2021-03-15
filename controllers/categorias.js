const { response, request } = require("express");
const { Categoria } = require('../models');

const crearCategoria = async( req = request , res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        });
    }

    // Generar data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }



    const categoria = new Categoria( data );
    await categoria.save();

    res.json({
        categoria
    })

}

module.exports = {
    crearCategoria,
}