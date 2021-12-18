/*
    Path: /api/uploads/
*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');


const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornaImagen } = require('../controllers/uploads');

const router = Router();

// Middleware con la configuración por defecto (dice qué)
router.use(expressFileUpload());

router.put('/:tipo/:id',validarJWT, fileUpload);

router.get('/:tipo/:foto', retornaImagen);



module.exports=router;