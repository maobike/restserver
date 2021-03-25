/**
 * /api/buscar
 */
 const { Router } = require('express');
const { buscar } = require('../controllers/buscar');
  
 const router = Router();
 
 /**
  * Obtener todas las categorías
  * Publico
  */
 router.get('/:collection/:search', buscar);
 
 
 module.exports = router;