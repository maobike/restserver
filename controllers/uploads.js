const { response, request } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto} = require('../models');

const cargarArchivo = async( req = request, res = response ) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({
            msg: 'No hay archivos que subir'
        });
        return;
    }

    try {
        //const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' );
        const nombre = await subirArchivo( req.files, undefined, 'images' );
        res.json({ nombre })
    } catch (error) {
        res.status(400).json({ error })
    }

}


const actualizarImagen = async( req, res = response ) => {
    const { collection, id } = req.params;

    let modelo;
    
    switch ( collection ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    const nombre = await subirArchivo( req.files, undefined, collection );
    modelo.img = nombre;

    await modelo.save();


    res.json( modelo )
}

module.exports = {
    cargarArchivo,
    actualizarImagen
}