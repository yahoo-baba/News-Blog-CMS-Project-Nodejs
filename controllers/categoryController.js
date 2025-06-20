const categoryModel = require('../models/Category');

const allCategory = async (req,res) => { 
  res.render('admin/categories' , { role: req.role })
}
const addCategoryPage = async (req,res) => {
  res.render('admin/categories/create', { role: req.role })
 }
const addCategory = async (req,res) => { }
const updateCategoryPage = async (req,res) => { 
  res.render('admin/categories/update', { role: req.role })
}
const updateCategory = async (req,res) => { }
const deleteCategory = async (req,res) => { }

module.exports = {
  allCategory,
  addCategoryPage,
  addCategory,
  updateCategoryPage,
  updateCategory,
  deleteCategory
}