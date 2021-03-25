/**
 * api/usuarios
 */

const { Router, request } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole, tieneRole} = require('../middlewares');

const { esRolValido, emailExiste, usuarioIdExiste } = require('../helpers/db-validators');

const { 
    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPatch 
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( usuarioIdExiste ),
    check('rol').custom( esRolValido ),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener más de 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    
    // check('rol').custom( (rol) => esRolValido(rol) ),
    // Cuando se tiene una función que su primer argumento es el mismo que se envía, se puede
    // obviar y simplificar la función, quedaría como la función de abajo.
    
    check('rol').custom( esRolValido ),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLES'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( usuarioIdExiste ),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);



module.exports = router;