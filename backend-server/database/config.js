const mongoose = require('mongoose');

const dbConnection = async() => {

    try{

        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        });
        console.log("DB online");
    }catch (error){
        console.log("Error");
        throw new Error("Error a la hora de iniciar la DB")
    } 

}


module.exports = {
    dbConnection
}

/*
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));
*/