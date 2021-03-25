/**
 * /api/productos
 */
const { Router } = require('express');
const { check } = require('express-validator');

const { 
    crearProducto, 
    obtenerProductosTodos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productos');
 
const { existeCategoria, existeProducto, existeCatUpdate } = require('../helpers/db-validators');    
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

/**
 * Obtener todos los productos
 * Publico
 */
router.get('/', obtenerProductosTodos);

/**
 * Obtener un producto por id
 * Publico
 * @param id id del producto
 */
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProducto );

/**
 * Crear un producto - 
 * @token Cualquier persona con token válido
 * @param data JSON con la información del producto
 */
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('categoria', 'No es un id valido').isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCampos
], crearProducto);

/**
 * Actualizar un producto 
 * @token Cualquier persona con token válido
 */
router.put('/:id', [
    validarJWT,
    check('id').custom( existeProducto ),
    validarCampos
], actualizarProducto);

/**
 * Borrar un producto
 * @token Admin con token válido
 */
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], eliminarProducto);


module.exports = router;