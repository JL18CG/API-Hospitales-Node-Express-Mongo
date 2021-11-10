const {response} = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { actualizarImagen } = require('../helpers/acttualizar-imagen');


const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    //validar tipo
    const tiposPermitidos = ['hospitales', 'usuarios', 'medicos'];
    if (!tiposPermitidos.includes(tipo)){
        return res.status(400).json({
            ok:false,
            msg:"No vale"
        });
    }

    //validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        //return res.status(400).send('No files were uploaded.');
        return res.status(400).json({
            ok:false,
            msg:"No vale imagen"
        });
    }

    //procesar archivo..
    const file = req.files.img;
    const nombreCortado = file.name.split('.');

    
    const extencion = nombreCortado[nombreCortado.length - 1];

    const extencionesValidas = ['png','jpg','jpeg', 'gif'];
    if(!extencionesValidas.includes(extencion)){
        return res.status(400).json({
            ok:false,
            msg:"No es una extención permitida"
        });
    }

    //generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${extencion}`;

    //path para guardar la imagen 
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //mover la imagen

    file.mv(path, function(err) {
        if (err){
            return res.status(500).json({
                ok:false,
                msg: "Error al mover el archivo"
            });
        } 
        
        //actualizar base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
        ok: true,
        msg: "Archivo subido",
        nombreArchivo
        });

    });


}


const retornaImg = (req, res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname,`../uploads/${tipo}/${foto}`);

    //imagen por defecto
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname,`../uploads/no-image.jpg`);
        res.sendFile(pathImg);
    }

 
}

module.exports={
    fileUpload,
    retornaImg
}