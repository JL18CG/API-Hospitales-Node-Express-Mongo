const {response} = require('express');
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/jwt');


const getUsuarios = async(req, res = response)=>{

    const desde = Number (req.query.desde) || 0;

    const [usuarios,total] =await Promise.all([
        Usuario
        .find({}, 'nombre email role google img')
        .skip(desde)
        .limit(10),

        Usuario.estimatedDocumentCount()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
        
    });
}

const crearUsuario = async(req, res = response)=>{

    //console.log(request.body);
    const {email, password} = req.body;


    try{

        const existeEmailUsuario = await Usuario.findOne({email});
        if(existeEmailUsuario){
            return res.status(400).json({
                ok:false,
                msg: "El correo ya está registrado"
            })
        }

        const usuario = new Usuario(req.body);

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password= bcrypt.hashSync(password);

        //Guardar usuario
        await usuario.save();

        //Generar el token 
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
                            ok:false, 
                            msg:"Error inesperado... revisar logs"
        });
    }

   
}


const putUsuario = async(req, res = response)=>{
    //TODO: Validar token y comprobar si es el usuario correcto  
    const uid= req.params.id;

    try{
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:"No existe un usuario por ese id"
            })
        }

        // Actualizaciones
        const {password, google, email, ...campos} = req.body;
        if( usuarioDB.email!= email ){
            const existEmail = await Usuario.findOne({email});
            if(existEmail){
                return res.status(400).json({
                    ok: false,
                    msg: "Ya existe un usuario con ese email"
                })
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true})


        res.json({
            ok:true,
            usuarioActualizado
        })

    }catch(error){
        res.status(500).json({
            ok:false,
            msg:"Error inesperado"
        })
    }

    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios
    });
}





const deleteUsuario = async(req, res = response)=>{

    const uid= req.params.id;

    try{
        const usuarioDB = await Usuario.findById(uid);


        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:"No existe ningun usuario con ese ID"
            });
        }

        await Usuario.findOneAndDelete(uid);
        res.status(200).json({
            ok:true,
            msg:"Usuario eliminado"
        });


    }catch(error){
        res.status(500).json({
            ok:false,
            msg:"Error inesperado Contacte con el administrador"
        })
    }

    res.json({
        ok: true,
        usuarios
    });
}


module.exports = {
    getUsuarios,
    crearUsuario,
    putUsuario,
    deleteUsuario
}