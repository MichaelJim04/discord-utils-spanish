const mongoose = require('mongoose')

exports.messages = require('./src/Messages')
exports.levels = require('./src/Levels.js')

/**
 * @param {String} [mongoUrl] - La URL de Mongoose
*/

exports.mongoConnect = async(mongoUrl) => {
    
    if (!mongoUrl) throw new TypeError("No se ha introducido un URL de la conexion a mongoose");
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).catch(err => {
        throw new TypeError("No ha sido posible conectar a la db, o se ha introducido una URL invalida");
        return false;
    })
    return true;
}
