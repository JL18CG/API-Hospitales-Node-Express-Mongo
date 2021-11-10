/*
    ruta : '/api/medicos'
*/

const { Router } =require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');


const { getMedicos, crearMedico, actualizarMedico, eliminarMedico } = require('../controllers/medicos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',getMedicos );

router.post('/',
                [
                    validarJWT,
                    check('nombre','El nombre del médico es necesario').not().isEmpty(),
                    check('hospital','El hospital ID debe de ser válido').isMongoId(),
                    validarCampos
                ],
                crearMedico );

router.put('/:id',
                [
                    validarJWT,
                    check('nombre','El nombre del medico es necesario').not().isEmpty(),
                    check('hospital','El hospital ID debe de ser válido').isMongoId(),
                    validarCampos
                ],actualizarMedico);


router.delete('/:id', eliminarMedico);

module.exports = router;
