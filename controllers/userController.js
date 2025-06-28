const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const userModel = require('../models/User');
const newsModel = require('../models/News');
const categoryModel = require('../models/Category');
const settingModel = require('../models/Setting');

dotenv.config()

const loginPage = async (req,res) => {
  res.render('admin/login',{
    layout: false
  })
 }

const adminLogin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return next(createError('Invalid username or password', 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       return next(createError('Invalid username or password', 401));
    }

    const jwtData = { id: user._id, fullname: user.fullname, role: user.role }
    const token = jwt.sign(jwtData, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.redirect('/admin/dashboard');
  } catch (error) {
    next(error)
  }
};

const logout = async (req,res) => {
  res.clearCookie('token')
  res.redirect('/admin/')
 }

const dashboard = async (req, res,next) => {
  try {
    let articleCount;
    if(req.role == 'author'){
      articleCount = await newsModel.countDocuments({ author: req.id });
    }else{
      articleCount = await newsModel.countDocuments();
    }
   
    const categoryCount = await categoryModel.countDocuments();
    const userCount = await userModel.countDocuments();

    res.render('admin/dashboard', { 
      role: req.role, 
      fullname: req.fullname,
      articleCount,
      categoryCount,
      userCount 
    });
  } catch (error) {
    next(error)
  }
}


const settings = async (req,res,next) => { 
  try {
    const settings = await settingModel.findOne()
    res.render('admin/settings', { role: req.role , settings})
  } catch (error) {
    next(error)
  }
}

const saveSettings = async (req, res, next) => {
  const { website_title, footer_description } = req.body;
  const website_logo = req.file?.filename;

  try {
    const settings = await settingModel.findOneAndUpdate(
      {},
      { website_title, website_logo, footer_description },
      { new: true, upsert: true }
    );

    res.redirect('/admin/settings');
  } catch (error) {
    next(error)
  }
  
}

const allUser = async (req,res) => { 
  const users = await userModel.find()
  res.render('admin/users', { users, role: req.role })
}
const addUserPage = async (req,res) => {
  res.render('admin/users/create' , { role: req.role })
 }

const addUser = async (req,res) => { 
  await userModel.create(req.body)
  res.redirect('/admin/users')
}

const updateUserPage = async (req,res,next) => {
  const id = req.params.id
  try {
    const user = await userModel.findById(id)
    if(!user){
      return next(createError('User not found', 404));
    }
    res.render('admin/users/update', { user , role:req.role })
  } catch (error) {
    next(error)
  }
  
 }

const updateUser = async (req,res,next) => {
  const id = req.params.id
  const { fullname, password, role } = req.body
  try {
    const user = await userModel.findById(id)
    if(!user){
      return next(createError('User not found', 404));
    }

    user.fullname = fullname || user.fullname
    if(password){
      user.password = password
    }
    
    user.role = role || user.role
    await user.save()

    res.redirect('/admin/users')
  } catch (error) {
    next(error)
  }
  
}
 

const deleteUser = async (req,res,next) => {
  const id = req.params.id
  try {
    const user = await userModel.findByIdAndDelete(id)
    if(!user){
      return next(createError('User not found', 404));
    }
    res.json({success:true})
  } catch (error) {
    next(error)
  }
}

module.exports = {
  loginPage,
  adminLogin,
  logout,
  allUser,
  addUserPage,
  addUser,
  updateUserPage,
  updateUser,
  deleteUser,
  dashboard,
  settings,
  saveSettings
}