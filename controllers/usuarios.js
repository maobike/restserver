const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = (req = request, res = response) => {
    const { nombre, sexo, edad = 'Sin edad' } = req.query;

    res.json({
        msg: 'get api - controlador',
        nombre, sexo, edad
    })
}

const usuariosPut = (req, res = response) => {
    const id = req.params.id;

    res.json({
        msg: 'put api - controlador',
        id
    })
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (  existeEmail ) {
        return res.status(400).json({
            msg: 'Ese correo ya esta registrado',
        });
    }

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en DB
    await usuario.save();
    res.json({
        usuario
    })
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete api - controlador'
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch api - controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}