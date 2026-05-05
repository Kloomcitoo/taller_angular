//  BUG #4: Rutas mal mapeadas
'use strict'
const express = require('express');
const multer = require('multer');
const controller = require('../controllers/articlecontroller');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload/articles/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter
});

router.get('/articles', controller.getAllArticles);
router.post('/articles', upload.single('imagen'), controller.createArticle);
router.put('/articles/:id', controller.updateArticle);
router.get('/articles/:id', controller.getArticleById);
router.delete('/articles/:id', controller.deleteArticle);

module.exports = router;
