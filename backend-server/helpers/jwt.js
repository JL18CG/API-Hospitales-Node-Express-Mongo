const jwt = require('jsonwebtoken');

const generarJWT =  (uid) =>{

    return new Promise((resolve, reject) =>{

        const payload = {
            uid
        };
    
        jwt.sign(payload, process.env.JST_SECRET,{
            expiresIn:'12h'
        }, (err, token) =>{
            if(err){
                console.log(err);
                reject('No se pudo generar el json web token');
            }else{
                resolve(token);
            }
        });

    });

}


module.exports = {
    generarJWT,
}