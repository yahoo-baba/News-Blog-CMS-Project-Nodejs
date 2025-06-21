const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');

const allArticle = async (req,res) => {
  res.render('admin/articles' , { role: req.role })
 }
const addArticlePage = async (req,res) => {
  res.render('admin/articles/create', { role: req.role })
 }
const addArticle = async (req,res) => { }
const updateArticlePage = async (req,res) => {
  res.render('admin/articles/update', { role: req.role })
 }
const updateArticle = async (req,res) => { }
const deleteArticle = async (req,res) => { }

module.exports = {
  allArticle,
  addArticlePage,
  addArticle,
  updateArticlePage,
  updateArticle,
  deleteArticle
}

