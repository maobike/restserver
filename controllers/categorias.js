const { response, request } = require("express");
const { Categoria } = require('../models');

/**
 * Obtiene todas las categorías existentes
 * @param limite limite de registros a mostrar 
 * @param desde desde que registro se inicia para mostrar
 */
const obtenerCategoriasTodas = async( req = request , res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query )
        .skip( Number( desde ) )
        .limit( Number( limite ) )
        .populate( 'usuario', 'nombre' )
    ]);
   
    res.json({
        total, categorias
    })
}

/**
 * Obtiene una categoría buscándola por su uid
 * @param uid id de la categoría a buscar
 */
const obtenerCategoria = async( req = request , res = response ) => {
    const id = req.params.id;
    const categoria = await Categoria.findById( id )
        .populate( 'usuario', 'nombre' )
    
    res.json({
        categoria
    })
   
}

/**
 * Crea una categoría
 * @param data arreglo JSON en el body de la categoría a crear 
 */
const crearCategoria = async( req = request , res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoría ${ categoriaDB.nombre } ya existe`
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


/**
 * Actualizar una categoría
 * @param data Objeto JSON con la data a actualizar
 */
const actualizarCategoria = async( req = request , res = response) => {
    const id = req.params.id;
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        });
    }

    // El { new: true} muestra en el res.json() la información del registro cambiado
    const categoria = await Categoria.findByIdAndUpdate( id, { nombre }, { new: true} );

    res.json( categoria );
}


/**
 * Elimina una categoría, pasa de estado true a false
 * @param id id de la categoría a actualizar
 */
const eliminarCategoria = async( req = request , res = response) => {
    const { id } = req.params;
    
    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new : true } );
    res.json( categoria );
}

module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenerCategoriasTodas,
    actualizarCategoria,
    eliminarCategoria
}