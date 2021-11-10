const {response} =require('express');
const bcrypt = require('bcryptjs'); 


const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response)=>{

    const {email, password} = req.body;

    try{
        //Verificar email
        const usuarioDB = await Usuario.findOne({email});
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg:"Email no válido"
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(404).json({
                ok: false,
                msg:"Contraseña no válida"
            });
        }

        //generar el token
        const token = await generarJWT(usuarioDB.id);

        res.status(200).json({
            ok: true,
            token
        });
    }catch(error){
        res.status(500).json({
            ok: false,
            msg:"Error inesperado Contacte con el administrador"
        });
    }
}


const loginGoogle = async(req, res = response) =>{

    const googleToken = req.body.token;


    try {

        const {name, email,picture} = await googleVerify(googleToken);
        
        //varificar si ya existe usuario en la base de datos
        const usuarioDB = await Usuario.findOne({email});
        let usuario;
        if(!usuarioDB){
            //el susuario "NO EXISTE"
            usuario= new Usuario({
                nombre: name,
                email,
                password:"@@@",
                img: picture,
                google: true
            });

        }else{
            //el susuario "SI EXISTE"
            usuario = usuarioDB;
            usuario.google = true;
          
        }

        //guardar en base de datos
        await usuario.save();

        //generar el token
        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            token
        });

    } catch (error) {
        
        res.status(401).json({
            ok: false,
            msg:"Token inválido"
        });

    }

}

const renewToken = async(req, res = response)=>{

    const uid = req.uid;

    //generar el token
    const token = await generarJWT(uid);


    //obtener el usuario
    const usuario = await Usuario.findById(uid); 

    res.json({
        ok:true,
        token,
        usuario
    })
}

module.exports = {
    login,
    loginGoogle,
    renewToken
}
