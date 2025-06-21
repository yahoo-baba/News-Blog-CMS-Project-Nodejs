const moongoose = require('mongoose');

const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const commentModel = require('../models/Comment');

const index = async (req,res) => {
  res.render('index')
 }
const articleByCategories = async (req,res) => {
  res.render('category')
 }
const singleArticle = async (req,res) => { 
  res.render('single')
}
const search = async (req,res) => {
  res.render('search')
 }
const author = async (req,res) => { 
  res.render('author')
}
const addComment = async (req,res) => { }

module.exports = {
  index,
  articleByCategories,
  singleArticle,
  search,
  author,
  addComment
}