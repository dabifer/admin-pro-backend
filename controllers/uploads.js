const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');


const fileUpload = (req, res = response)=>{
    const tipo = req.params.tipo;
    const id = req.params.id;

    // Validar tipo
    const tiposValidos = ['usuarios', 'medicos', 'hospitales'];
    if(!tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok: false,
            msg: 'El tipo debe ser medicos, usuarios u hospitales'
        });
    }

    // Validar que exista algún archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    // Processar la imagen
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.'); // Ej: nombre.de.archivo.jpg
    const extensionArchivo = nombreCortado[nombreCortado.length-1]; // {[nombre]0[de]1[archivo]2[jpg]3} lengh = 4. i=3

    // Validar extensión
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if(!extensionesValidas.includes(extensionArchivo)){
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen. Use the mv() method to place the file somewhere on your server
    file.mv(path, (err)=> {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imágen'
            });

    }

    // Actualizar base de datos
    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
        ok: true,
        msg:'Archivo subido',
        nombreArchivo
    });
  });    
}


const retornaImagen = (req, res =response)=>{
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    let pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // Imagen por defecto
    /* if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }*/

    // El código anterior lo hizo el profesor. El siguiente lo hice yo
    if(!fs.existsSync(pathImg)){
        pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
    }
    
    res.sendFile(pathImg);
    

}

module.exports={
    fileUpload,
    retornaImagen
}