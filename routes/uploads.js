/**
 * /api/uploads
 */
const { Router } = require('express');
const { check } = require('express-validator');
 
const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { allowedCollections } = require('../helpers');
  
const router = Router();
 
router.post('/', validarArchivoSubir, cargarArchivo );
 
router.put('/:collection/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['usuarios','productos']) ),
    validarCampos
], actualizarImagenCloudinary )

router.get('/:collection/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['usuarios','productos']) ),
    validarCampos
], mostrarImagen);

module.exports = router; 