/*
    ruta : '/api/todo'
*/

const { Router } =require('express');


const { getBusqueda, getDocs} = require('../controllers/busquedas');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:busqueda',validarJWT,getBusqueda );
router.get('/coleccion/:tabla/:busqueda',validarJWT,getDocs );

module.exports = router;


