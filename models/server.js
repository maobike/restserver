const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        // Conectar a base de datos
        this.conectarDb();

        // MiddleWares
        this.middleWares();

        // Rutas de la aplicación
        this.routes();
    }

    async conectarDb(){
        await dbConnection();
    }

    middleWares() {

        // CORS
        this.app.use( cors() );

        // Directorio público
        this.app.use( express.static('public') );

        // Lectura y parseo del Body
        this.app.use( express.json() );

    }

    routes() {

          this.app.use( this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Corriendo en el puerto ${ this.port }`);
        });        
    }

}

module.exports = Server;
