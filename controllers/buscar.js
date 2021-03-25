const { response, request } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto, Role } = require('../models');

const collectPermitidas = [ 'usuarios', 'categorias', 'productos', 'roles' ];

const buscarUsuarios = async( termino = '', res = response ) => {
    const esMongoId = ObjectId.isValid( termino ); 

    if ( esMongoId ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results:  ( usuario ) ? [ usuario ] : []
        })
    }

    const regex = new RegExp( termino, 'i' );

    const usuarios = await Usuario.find({
        $or:  [ { nombre: regex }, { correo: regex } ],
        $and: [ { estado: true } ]
    });

    res.json({
        results: usuarios
    })
}

const buscarCategorias = async( termino = '', res = response ) => {
    const esMongoId = ObjectId.isValid( termino ); 

    if ( esMongoId ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results:  ( categoria ) ? [ categoria ] : []
        })
    }

    const regex = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    })
}

const buscarProductos = async( termino = '', res = response ) => {
    const esMongoId = ObjectId.isValid( termino ); 

    if ( esMongoId ) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre');
        return res.json({
            results:  ( producto ) ? [ producto ] : []
        })
    }

    const regex = new RegExp( termino, 'i' );

    const producto = await Producto.find({
        $or:  [ { nombre: regex }, { descripcion: regex } ],
        $and: [ { estado: true } ]
    }).populate('categoria', 'nombre');

    res.json({
        results: producto
    })
}

const buscarRoles = async( termino = '', res = response ) => {
    const esMongoId = ObjectId.isValid( termino ); 

    if ( esMongoId ) {
        const rol = await Role.findById(termino);
        return res.json({
            results:  ( rol ) ? [ rol ] : []
        })
    }

    const regex = new RegExp( termino, 'i' );

    const roles = await Role.find({
        $or:  [ { rol: regex } ]
    });

    res.json({
        results: roles
    })
}

const buscar = async( req = request , res = response ) => {
    const { collection, search } = req.params;
   

    // Buscar la colección sea permitida
    if ( !collectPermitidas.includes( collection ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ collectPermitidas }`
        });
    }

    switch (collection) {
        case 'usuarios':
            buscarUsuarios(search, res);
        break;

        case 'categorias':
            buscarCategorias(search, res);
        break;

        case 'productos':
            buscarProductos(search, res);
        break;

        case 'roles':
            buscarRoles(search, res);
        break;
    
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta búsqueda'
            })
        break;
    }

}

module.exports = {
    buscar
}