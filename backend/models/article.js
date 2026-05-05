'use strict'

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Título requerido'],
    trim: true,
    minlength: [1, 'Título requerido'],
    maxlength:[100, 'Título demasiado largo (máx. 100 caracteres)']
  },
  descripcion: {
    type: String,
    maxlength: [100, 'Descripción demasiado larga (máx. 100 caracteres)']
  },
  precio: {
    type: Number,
    required: [true, 'Precio requerido'],
    min: [0.01, 'Precio debe ser > 0']
  },
  categoria: {
    type: String,
    enum: {
      values: ['tecnologia', 'ropa', 'otros'],
      message: 'Categoría inválida. Use: tecnologia, ropa, otros'
    },
    required: [true, 'Categoría requerida']
  },
  imagen: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
