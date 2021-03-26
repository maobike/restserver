const path = require('path');
const fs   = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response, request } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto} = require('../models');

const cargarArchivo = async( req = request, res = response ) => {

    try {
        //const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' );
        const nombre = await subirArchivo( req.files, undefined, 'images' );
        res.json({ nombre })
    } catch (error) {
        res.status(400).json({ error });
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
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    // Eliminar imagen si ya existe
    if ( modelo.img ) {
        // Eliminar imagen del server
        const pathImagen = path.join( __dirname, '../uploads', collection, modelo.img);
        if ( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen );
        }
    }

    const nombre = await subirArchivo( req.files, undefined, collection );
    modelo.img = nombre;

    await modelo.save();

    res.json( modelo )
}

const actualizarImagenCloudinary = async( req, res = response ) => {
    const { collection, id } = req.params;
    let modelo;
    
    switch ( collection ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    // Eliminar imagen si ya existe
    if ( modelo.img ) {
        const nombreArr = modelo.img.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );
    }

    try {
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.img = secure_url;

        await modelo.save();

        res.json( modelo );
    } catch (error) {
        return res.status(400).json(error);
    }
    

}


const mostrarImagen = async( req, res = response ) => {
    const { collection, id } = req.params;
    let modelo;
    
    switch ( collection ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    // Eliminar imagen si ya existe
    if ( modelo.img ) {
        // Eliminar imagen del server
        const pathImagen = path.join( __dirname, '../uploads', collection, modelo.img);
        if ( fs.existsSync( pathImagen ) ) {
            return res.sendFile( pathImagen )
        }
     
    }

    const pathImagen =  path.join( __dirname, `../assets/no-image.jpg`);
    res.sendFile( pathImagen );

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}