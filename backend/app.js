'use strict'
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const articleRoutes = require('./routes/articleroutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('upload'));

app.get('/', (req, res) => {
  res.json({ message: 'Servidor OK - Sesión 3' });
});

app.use('/api', articleRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Archivo demasiado grande. Tamaño máximo: 2MB'
      });
    }
    return res.status(400).json({ success: false, error: err.message });
  }

  if (err.message === 'Tipo de archivo no permitido') {
    return res.status(400).json({
      success: false,
      error: 'Tipo de archivo no permitido. Use: jpg, png o gif'
    });
  }

  res.status(500).json({ success: false, error: 'Error en servidor' });
});

module.exports = app;
