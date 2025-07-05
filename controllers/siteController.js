const moongoose = require('mongoose');

const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const commentModel = require('../models/Comment');

const index = async (req,res) => {
  const news = await newsModel.find()
                        .populate('category',{'name':1, 'slug':1})
                        .populate('author','fullname')
                        .sort({createdAt: -1})

  const categoriesInUse = await newsModel.distinct('category')   
  const categories = await categoryModel.find({'_id':{$in:categoriesInUse}})                   
  // res.json({ news, categories })
  res.render('index', { news, categories })
 }


const articleByCategories = async (req,res) => {
  const category = await categoryModel.findOne({ slug: req.params.name });

  if (!category) {
    return res.status(404).send('Category not found');
  }

  const news = await newsModel.find({ category: category._id })
                        .populate('category',{'name':1, 'slug':1})
                        .populate('author','fullname')
                        .sort({createdAt: -1})

  const categoriesInUse = await newsModel.distinct('category')   
  const categories = await categoryModel.find({'_id':{$in:categoriesInUse}})   

  res.render('category', { news, categories, category })
 }

const singleArticle = async (req,res) => { 
  const singleNews = await newsModel.findById(req.params.id)
                        .populate('category',{'name':1, 'slug':1})
                        .populate('author','fullname')
                        .sort({createdAt: -1})

  const categoriesInUse = await newsModel.distinct('category')   
  const categories = await categoryModel.find({'_id':{$in:categoriesInUse}}) 

  res.render('single', { singleNews, categories })
}

const search = async (req,res) => {
  const searchQuery = req.query.search

  const news = await newsModel.find({
                      $or: [
                        { title: { $regex: searchQuery, $options: 'i' } },
                        { content: { $regex: searchQuery, $options: 'i' } }
                      ]
                    })
                    .populate('category',{'name':1, 'slug':1})
                    .populate('author','fullname')
                    .sort({createdAt: -1})

  const categoriesInUse = await newsModel.distinct('category')   
  const categories = await categoryModel.find({'_id':{$in:categoriesInUse}}) 

  res.render('search', { news, categories, searchQuery })
 }
const author = async (req,res) => { 
  const author = await userModel.findOne({ _id: req.params.name });
  if (!author) {
    return res.status(404).send('Author not found');
  }

  const news = await newsModel.find({ author: req.params.name })
                        .populate('category',{'name':1, 'slug':1})
                        .populate('author','fullname')
                        .sort({createdAt: -1})
  // res.json(news)
  const categoriesInUse = await newsModel.distinct('category')   
  const categories = await categoryModel.find({'_id':{$in:categoriesInUse}}) 

  res.render('author', { news, categories, author })
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