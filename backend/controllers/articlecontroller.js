const Article = require('../models/article');
const mongoose = require('mongoose');

const formatValidationError = (error) => {
  if (error && error.name === 'ValidationError') {
    const firstError = Object.values(error.errors)[0];
    return firstError && firstError.message ? firstError.message : error.message;
  }
  return error.message;
};

exports.createArticle = async (req, res) => {
  try {
    const { titulo, descripcion, precio, categoria } = req.body;
    
    const article = new Article({
      titulo,
      descripcion,
      precio,
      categoria,
      imagen: req.file ? req.file.filename : null
    });

    await article.save();
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(400).json({ success: false, error: formatValidationError(error) });
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Article.countDocuments()
    ]);

    res.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, error: 'Artículo no encontrado' });
    }
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, error: 'Artículo no encontrado' });
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const { descripcion, precio } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, error: 'Artículo no encontrado' });
    }
    const article = await Article.findByIdAndUpdate(
      id,
      { descripcion, precio },
      { new: true, runValidators: true }
    );

    if (!article) return res.status(404).json({ success: false, error: 'Artículo no encontrado' });
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(400).json({ success: false, error: formatValidationError(error) });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, error: 'Artículo no encontrado' });
    }
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ success: false, error: 'Artículo no encontrado' });
    res.json({ message: 'Artículo eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
