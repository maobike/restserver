const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs =  require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async( req, res = response ) => {
    const { correo, password } = req.body;

    try {
        // Verificar si existe email
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos : Correo malo'
            })
        }

        // Si el usuario esta activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'El Usuario / Password no son correctos : Estado False'
            })
        }

        // Verificar la clave
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'El Usuario / Password no son correctos : Password malo'
            })
        }

        // generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

    
}

const googleSingIn = async( req, res = response) => {
    const { id_token } = req.body

    try {
        const { correo, nombre, img } = await googleVerify( id_token);

        let usuario = await Usuario.findOne({ correo });

        // Si el usuario no existe
        if ( !usuario ) {
            // Se crea el usuario
            const data = {
                nombre,
                correo,
                password: '123',
                img,
                google: true
            }
            const usuario = new Usuario( data );
            await usuario.save();
        }
        

        // Si el usuario en DB esta en estado falso
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        // generar el JWT
        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es valido'
        })
    }

}

module.exports = {
    login,
    googleSingIn
}