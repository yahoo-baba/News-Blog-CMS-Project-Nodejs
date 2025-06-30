const commentModel = require('../models/Comment');
const createError = require('../utils/error-message')
const { validationResult } = require('express-validator')

const allComments = async (req,res) => { 
  res.render('admin/comments', { role: req.role })
}

module.exports = {
  allComments
}