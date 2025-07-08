const moongoose = require('mongoose');

const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const settingModel = require('../models/Setting');
const commentModel = require('../models/Comment');
const paginate = require('../utils/paginate')

const index = async (req,res) => {

  const paginatedNews = await paginate(newsModel, {}, 
                                      req.query, {
                                      populate: [
                                        { path: 'category', select: 'name slug' },
                                        { path: 'author', select: 'fullname' }
                                      ],   
                                      sort: '-createdAt' })

  // res.json({ paginatedNews })
  res.render('index', { paginatedNews , query: req.query})
 }


const articleByCategories = async (req,res) => {
  const category = await categoryModel.findOne({ slug: req.params.name });
  if (!category) {
    return res.status(404).send('Category not found');
  }
  const paginatedNews = await paginate(newsModel, { category: category._id }, 
                                      req.query, {
                                      populate: [
                                        { path: 'category', select: 'name slug' },
                                        { path: 'author', select: 'fullname' }
                                      ],   
                                      sort: '-createdAt' })

  res.render('category', { paginatedNews, category, query: req.query })
 }

const singleArticle = async (req,res) => { 
  const singleNews = await newsModel.findById(req.params.id)
                        .populate('category',{'name':1, 'slug':1})
                        .populate('author','fullname')
                        .sort({createdAt: -1})

  res.render('single', { singleNews })
}

const search = async (req,res) => {
  const searchQuery = req.query.search

  const paginatedNews = await paginate(newsModel, {
                              $or: [
                                { title: { $regex: searchQuery, $options: 'i' } },
                                { content: { $regex: searchQuery, $options: 'i' } }
                              ]
                            }, 
                            req.query, {
                            populate: [
                              { path: 'category', select: 'name slug' },
                              { path: 'author', select: 'fullname' }
                            ],   
                            sort: '-createdAt' })


  res.render('search', { paginatedNews, searchQuery, query: req.query })
 }
const author = async (req,res) => { 
  const author = await userModel.findOne({ _id: req.params.name });
  if (!author) {
    return res.status(404).send('Author not found');
  }

  const paginatedNews = await paginate(newsModel, { author: req.params.name  }, 
                                      req.query, {
                                      populate: [
                                        { path: 'category', select: 'name slug' },
                                        { path: 'author', select: 'fullname' }
                                      ],   
                                      sort: '-createdAt' })


  res.render('author', { paginatedNews, author, query: req.query })
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