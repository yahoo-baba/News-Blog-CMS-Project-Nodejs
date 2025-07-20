const commentModel = require('../models/Comment');
const newsModel = require('../models/News');
const createError = require('../utils/error-message')
const { validationResult } = require('express-validator')

const allComments = async (req,res,next) => { 
  try {
    let comments;
    if(req.role === 'admin'){
      comments = await commentModel.find()
                                      .populate('article', 'title')
                                      .sort({ createdAt: -1 });
    }else{
      const news = await newsModel.find({ author: req.id });
      const newsIds = news.map(news => news._id);
      comments = await commentModel.find({ article: { $in: newsIds } })
                                      .populate('article', 'title')
                                      .sort({ createdAt: -1 });
    }
    
    // res.json(comments)                                  
    res.render('admin/comments', { comments, role: req.role });
  } catch (error) {
    next(createError('Error fetching comments', 500));
  }
 
}

const updateCommentStatus = async (req,res,next) => { 
  try {
    const comment = await commentModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if(!comment){
      return next(createError('Comment not found', 404));
    }
    // res.redirect('/admin/comments');
    res.json({ success: true });
  } catch (error) {
    next(createError('Error updating comment status', 500));
  }
  
}

const deleteComment = async (req,res,next) => { 
  try {
    const comment = await commentModel.findByIdAndDelete(req.params.id);
    if(!comment){
      return next(createError('Comment not found', 404));
    }
    res.json({ success: true });
  } catch (error) {
    next(createError('Error deleting comment', 500));
  }
  
}

module.exports = {
  allComments,
  updateCommentStatus,
  deleteComment
}