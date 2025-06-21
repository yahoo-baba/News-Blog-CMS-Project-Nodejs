const commentModel = require('../models/Comment');

const allComments = async (req,res) => { 
  res.render('admin/comments', { role: req.role })
}

module.exports = {
  allComments
}