/**
 * /api/categorias
 */
const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria } = require('../controllers/categorias');
const { validarJWT, validarCampos } = require('../middlewares');

const router = Router();

/**
 * Obtener todas las categorías
 * Publico
 */
router.get('/', ( req , res ) => {
    return res.json({
        msg: 'Get'
    })
})

/**
 * Obtener una categoría por id
 * Publico
 */
router.get('/:id', ( req , res ) => {
    return res.json({
        msg: `Get ${ req.params.id }`
    })
})

/**
 * Crear una categoría - 
 * @token Cualquier persona con token válido
 */
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], crearCategoria)

/**
 * Actualizar una categoría - 
 * @token Cualquier persona con token válido
 */
router.put('/:id', ( req , res ) => {
    return res.json({
        msg: `Put ${ req.params.id }`
    })
})

/**
 * Borrar una categoría - 
 * @token Admin con token válido
 */
router.delete('/:id', ( req , res ) => {
    return res.json({
        msg: `Delete ${ req.params.id }`
    })
})

module.exports = router;





