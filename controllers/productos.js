const { response, request } = require("express");
const { Producto, Categoria } = require('../models');

/**
 * Obtiene todas los productos existentes
 * @param limite limite de registros a mostrar 
 * @param desde desde que registro se inicia para mostrar
 */
 const obtenerProductosTodos = async( req = request , res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
        .skip( Number( desde ) )
        .limit( Number( limite ) )
        .populate( 'categoria', 'nombre' )
        .populate( 'usuario', 'nombre' )
    ]);
   
    res.json({
        total, productos
    })
}


/**
 * Obtiene un producto buscándola por su uid
 * @param uid id del producto a buscar
 */
 const obtenerProducto = async( req = request , res = response ) => {
    const id = req.params.id;
    const producto = await Producto.findById( id )
        .populate( 'categoria', 'nombre' )
        .populate( 'usuario', 'nombre' )
    
    res.json( producto )
   
}


/**
 * Crea una categoría
 * @param data arreglo JSON en el body de la categoría a crear 
 */
const crearProducto = async( req = request , res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB  = await Producto.findOne({ nombre: body.nombre.toUpperCase() });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ body.nombre } ya existe`
        });
    }

    // Generar data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data );
    await producto.save();

    res.json( producto );
}


/**
 * Actualizar un producto
 * @param data Objeto JSON con la data a actualizar
 */
 const actualizarProducto = async( req = request , res = response) => {
    const id = req.params.id;
    const { estado, usuario, ...data } = req.body;
    
    if ( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;


    // El { new: true} muestra en el res.json() la información del registro cambiado
    const producto = await Producto.findByIdAndUpdate( id, data, { new: true} );

    res.json( producto );
}

/**
 * Elimina un producto, pasa de estado true a false
 * @param id id del producto a actualizar
 */
 const eliminarProducto = async( req = request , res = response) => {
    const { id } = req.params;
    
    const producto = await Producto.findByIdAndUpdate( id, { estado: false }, { new : true } );
    res.json( producto );
}

module.exports = {
    crearProducto,
    obtenerProductosTodos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
}