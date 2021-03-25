const { Schema, model  } = require('mongoose');

const CategoriaSchema = Schema({
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
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
});

// Esto saca los primeros parámetros del retorno JSON en la respuesta del endpoint.
CategoriaSchema.methods.toJSON = function() {
    const { __v, _id, estado, ...categoria  } = this.toObject();
    categoria.uid = _id;
    return categoria;
}


module.exports = model( 'Categoria', CategoriaSchema );