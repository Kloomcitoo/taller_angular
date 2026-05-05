'use strict'
var mongoose = require('mongoose')

const app = require('./app');

var port = 3800;

mongoose.connect('mongodb://localhost:27017/evaluacion-db').then(() => {
    console.log('conexion exitosa');
    app.listen(port, () => {
        console.log('Servidor corriendo en http://localhost:' + port)
    });
    })
    .catch((err) => {
        console.log('Error de conexion', err)
})
