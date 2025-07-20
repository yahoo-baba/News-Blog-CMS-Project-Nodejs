const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const fs = require('fs')
const path = require('path')
const createError = require('../utils/error-message');
const { validationResult } = require('express-validator')

const allArticle = async (req,res,next) => {
  try {
    let articles;
    if(req.role === 'admin'){ 
     articles = await newsModel.find()
                                .populate('category','name')
                                .populate('author','fullname');
    }else{
      articles = await newsModel.find({ author: req.id })
                                .populate('category','name')
                                .populate('author','fullname');
    }                            
    res.render('admin/articles', { role: req.role, articles });
  } catch (error) {
    // console.error(error);
    // res.status(500).send('Server Error');
    next(error)
  }
}

const addArticlePage = async (req,res) => {
  const categories = await categoryModel.find();
  res.render('admin/articles/create', { role: req.role, categories, errors: 0 });
}

const addArticle = async (req,res,next) => { 
  console.log(req.body, req.file)

  const errors = validationResult(req); 
       if (!errors.isEmpty()) {
        const categories = await categoryModel.find();
        return res.render('admin/articles/create',{
          role: req.role,
          errors: errors.array(),
          categories
        })
      }

  try {
    const { title, content, category } = req.body;
    const article = new newsModel({
      title,
      content,
      category,
      author: req.id,
      image: req.file.filename
    });
    await article.save();
    res.redirect('/admin/article');
  } catch (error) {
    // console.log(error);
    // res.status(500).send('Article not saved');
    next(error)
  }
}

const updateArticlePage = async (req,res,next) => {
  const id = req.params.id;

  try {
    const article = await newsModel.findById(id)
                                   .populate('category', 'name')
                                   .populate('author', 'fullname');
    if (!article) {
      return next(createError('Article not found', 404));
    }

    if(req.role == 'author'){
      if(req.id != article.author._id){
        return next(createError('Unauthorized', 401));
      }
    }

    const categories = await categoryModel.find();
    res.render('admin/articles/update', { role: req.role, article, categories, errors:0 });
  } catch (error) {
    // console.error(error);
    // res.status(500).send('Server Error');
    next(error)
  }
}

const updateArticle = async (req,res,next) => {
  const id = req.params.id;

  const errors = validationResult(req); 
    if (!errors.isEmpty()) {
    const categories = await categoryModel.find();
    return res.render('admin/articles/update',{
      article: req.body,
      role: req.role,
      errors: errors.array(),
      categories
    })
  }
  
  try {
    const { title, content, category } = req.body;
    const article = await newsModel.findById(id);
    if (!article) {
      return next(createError('Article not found', 404));
    }

    if(req.role == 'author'){
      if(req.id != article.author._id){
        return next(createError('Unauthorized', 401));
      }
    }

    article.title = title;
    article.content = content;
    article.category = category;

    if (req.file) {
      const imagePath = path.join(__dirname, '../public/uploads', article.image);
      fs.unlinkSync(imagePath);
      article.image = req.file.filename;
    }

    await article.save();
    res.redirect('/admin/article');
  } catch (error) {
   next(error)
  }
 }

const deleteArticle = async (req,res,next) => { 
  const id = req.params.id;
  try {
    const article = await newsModel.findById(id);
    if (!article) {
      return next(createError('Article not found', 404));
    }

    if(req.role == 'author'){
      if(req.id != article.author._id){
        return next(createError('Unauthorized', 401));
      }
    }

    try {
        const imagePath = path.join(__dirname, '../public/uploads', article.image);
        fs.unlinkSync(imagePath);
    } catch (error) {
        console.error('Error deleting image:', error);
    }

    await article.deleteOne()
    res.json({ success: true });
  } catch (error) {
    next(error)
  }
}

module.exports = {
  allArticle,
  addArticlePage,
  addArticle,
  updateArticlePage,
  updateArticle,
  deleteArticle
}

