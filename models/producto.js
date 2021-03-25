const { Schema, model  } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: [true, 'El estado es obligatorio']
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: String,
        default: true
    },
    img: {
        type : String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
});

// Esto saca los primeros parámetros del retorno JSON en la respuesta del endpoint.
ProductoSchema.methods.toJSON = function() {
    const { __v, _id, estado, ...object  } = this.toObject();
    object.uid = _id;
    return object;
}


module.exports = model( 'Producto', ProductoSchema );