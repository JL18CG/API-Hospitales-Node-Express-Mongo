require('dotenv').config();

const express= require('express');
const cors = require('cors')

const {dbConnection} = require('./database/config'); 


//crear el servidor express
const app = express();



//base de datos}
dbConnection();

//directorio publico
app.use(express.static('public'));

//configurar CORS
app.use(cors())


//Lectura y parseo del body
app.use( express.json() );


//rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));

app.listen(process.env.PORT, ()=>{
    console.log("servidor corriendo en el puerto " + process.env.PORT)
});
