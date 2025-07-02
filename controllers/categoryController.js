const categoryModel = require('../models/Category');
const newsModel = require('../models/News')
const createError = require('../utils/error-message')
const { validationResult } = require('express-validator')

const allCategory = async (req,res) => { 
  const categories = await categoryModel.find()
  res.render('admin/categories' , { categories, role: req.role })
}
const addCategoryPage = async (req,res) => {
  res.render('admin/categories/create', { role: req.role, errors:0 })
 }

const addCategory = async (req,res) => { 
  const errors = validationResult(req); 
     if (!errors.isEmpty()) {
      return res.render('admin/categories/create',{
        role: req.role,
        errors: errors.array()
      })
    }

  try {
    await categoryModel.create(req.body)
    res.redirect('/admin/category');
  } catch (error) {
    res.status(500).send(error);
  }
}

const updateCategoryPage = async (req,res,next) => { 
  const id = req.params.id;
  try {
    const category = await categoryModel.findById(id);
    if(!category){
      return next(createError('Category not found', 404));
    }
    res.render('admin/categories/update', { category, role: req.role, errors: 0 })
  } catch (error) {
    // res.status(400).send(error);
    next(error)
  }
}

const updateCategory = async (req,res,next) => {
  const id = req.params.id;

  const errors = validationResult(req); 
     if (!errors.isEmpty()) {
      const category = await categoryModel.findById(id)
      return res.render('admin/categories/update',{
        category,
        role: req.role,
        errors: errors.array()
      })
    }
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return next(createError('Category not found', 404));
    }

    category.name = req.body.name;
    category.description = req.body.description;

    await category.save();
    res.redirect('/admin/category');
  } catch (error) {
    // res.status(400).send(error);
    next(error)
  }
 }

const deleteCategory = async (req,res,next) => {
  const id = req.params.id;
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return next(createError('Category not found', 404));
    }

    const article = await newsModel.findOne({ category: id });
    if (article) {
      return res.status(400).json({ success: false, message: 'Category is associated with an article' });
    }

    await category.deleteOne();
    res.json({ success: true });
  } catch (error) {
    // res.status(400).send(error);
    next(error)
  }
 }

module.exports = {
  allCategory,
  addCategoryPage,
  addCategory,
  updateCategoryPage,
  updateCategory,
  deleteCategory
}