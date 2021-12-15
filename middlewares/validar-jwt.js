const { response } = require('express');
const jwt= require('jsonwebtoken');



const validarJWT = (req,res=response, next)=>{

    // Leer el tóken
    const token = req.header('x-token');
    
    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay tóken en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Tóken no válido'
        });        
    }
    
}

module.exports = {
    validarJWT
}