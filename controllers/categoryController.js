const categoryModel = require('../models/Category');

const allCategory = async (req,res) => { 
  const categories = await categoryModel.find()
  res.render('admin/categories' , { categories, role: req.role })
}
const addCategoryPage = async (req,res) => {
  res.render('admin/categories/create', { role: req.role })
 }

const addCategory = async (req,res) => { 
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
    res.render('admin/categories/update', { category, role: req.role })
  } catch (error) {
    // res.status(400).send(error);
    next(error)
  }
}

const updateCategory = async (req,res,next) => {
  const id = req.params.id;
  try {
    const category = await categoryModel.findByIdAndUpdate(id, req.body);
    if(!category){
      return next(createError('Category not found', 404));
    }
    res.redirect('/admin/category');
  } catch (error) {
    // res.status(400).send(error);
    next(error)
  }
 }

const deleteCategory = async (req,res,next) => {
  const id = req.params.id;
  try {
    const category = await categoryModel.findByIdAndDelete(id);
    if(!category){
      return next(createError('Category not found', 404));
    }
   res.json({success:true})
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