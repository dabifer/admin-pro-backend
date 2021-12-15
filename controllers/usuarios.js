const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res)=>{

    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios
    })
}

// ---------------- CREAR USUARIO -------------------------------
const crearUsuario = async(req, res = response)=>{

    const {email, password} = req.body;

    try {
        const existeEmail = await Usuario.findOne({email});

        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
            
        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);

        // Guardar usuario
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuario.id);
    
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Revisar log'
        });
    }
}

// --------------- ACTUALIZAR USUARIO ---------------------------
const actualizarUsuario = async(req, res = response) =>{

      // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;
    
    try {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg: 'No existe usuario con ese id'
            });
        }
        
        
        // Actualizaciones
        const {password,google,email, ...campos} = req.body;

        if(usuarioDB.email !== email){            
            const existeMail = await Usuario.findOne({email});
            if(existeMail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe usuario con es email'
                });
            }
        }
        campos.email=email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos,{new:true});
      
        res.json({
            ok:true,
            usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });        
    }
}

// -------------- ELIMINAR USUARIO -----------------------------
const borrarUsuario = async (req, res = response) =>{
    
    const uid=req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg: 'No existe usuario con ese id'
            });
        }

        await usuarioDB.remove();

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });        
    }

    
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}