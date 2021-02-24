const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        // MiddleWares
        this.middleWares();

        // Rutas de la aplicación
        this.routes();
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
