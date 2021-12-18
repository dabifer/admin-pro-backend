/*
    Médicos
    Ruta: /api/medicos
*/

const { Router } = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');


const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');

const router = Router();



router.get('/', getMedicos);

// Crear médico
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre del médico es obligatorio').not().isEmpty(),
    check('hospital', 'El id del debe ser válido').isMongoId(),
    validarCampos
], crearMedico);

// Actualizar médico
router.put('/:id',[], actualizarMedico);

// Eliminar médico
router.delete('/:id',
    borrarMedico
);



module.exports = router;