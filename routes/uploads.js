/**
 * /api/uploads
 */
const { Router } = require('express');
const { check } = require('express-validator');
 
const { validarCampos } = require('../middlewares');
const { cargarArchivo, actualizarImagen } = require('../controllers/uploads');
const { allowedCollections } = require('../helpers');
  
const router = Router();
 
router.post('/', cargarArchivo );
 
router.put('/:collection/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['usuarios','productos']) ),
    validarCampos
], actualizarImagen )
 
module.exports = router; 