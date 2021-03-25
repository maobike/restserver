/**
 * /api/categorias
 */
const { Router } = require('express');
const { check } = require('express-validator');

const { 
    crearCategoria, 
    obtenerCategoria, 
    obtenerCategoriasTodas, 
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categorias');

const { existeCategoria } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

/**
 * Obtener todas las categorías
 * Publico
 */
router.get('/', obtenerCategoriasTodas);

/**
 * Obtener una categoría por id
 * Publico
 * @param id id de la categoría
 */
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoria );

/**
 * Crear una categoría - 
 * @token Cualquier persona con token válido
 */
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], crearCategoria);

/**
 * Actualizar una categoría - 
 * @token Cualquier persona con token válido
 */
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoria ),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], actualizarCategoria);

/**
 * Borrar una categoría - 
 * @token Admin con token válido
 */
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], eliminarCategoria);

module.exports = router;




