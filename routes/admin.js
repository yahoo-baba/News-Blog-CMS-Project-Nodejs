const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const UserController = require('../controllers/UserController');
const isLoggedIn = require('../middleware/isLoggedin')
const isAdmin = require('../middleware/isAdmin')

//Login Routes
router.get('/', UserController.loginPage);
router.post('/index', UserController.adminLogin);
router.get('/logout', UserController.logout);
router.get('/dashboard', isLoggedIn, UserController.dashboard);
router.get('/settings', isLoggedIn, isAdmin, UserController.settings);

//User CRUD Routes
router.get('/users', isLoggedIn, isAdmin, UserController.allUser);
router.get('/add-user', isLoggedIn, isAdmin, UserController.addUserPage);
router.post('/add-user', isLoggedIn, isAdmin, UserController.addUser);
router.get('/update-user/:id', isLoggedIn, isAdmin, UserController.updateUserPage);
router.post('/update-user/:id', isLoggedIn, isAdmin, UserController.updateUser);
router.delete('/delete-user/:id', isLoggedIn, isAdmin, UserController.deleteUser);

//Category CRUD Routes
router.get('/category', isLoggedIn, isAdmin, categoryController.allCategory);
router.get('/add-category', isLoggedIn, isAdmin, categoryController.addCategoryPage);
router.post('/add-category', isLoggedIn, isAdmin, categoryController.addCategory);
router.get('/update-category/:id', isLoggedIn, isAdmin, categoryController.updateCategoryPage);
router.post('/update-category/:id', isLoggedIn, isAdmin, categoryController.updateCategory);
router.delete('/delete-category/:id', isLoggedIn, isAdmin, categoryController.deleteCategory);

//Article CRUD Routes
router.get('/article', isLoggedIn, articleController.allArticle);
router.get('/add-article', isLoggedIn, articleController.addArticlePage);
router.post('/add-article', isLoggedIn, articleController.addArticle);
router.get('/update-article/:id', isLoggedIn, articleController.updateArticlePage);
router.post('/update-article/:id', isLoggedIn, articleController.updateArticle);
router.delete('/delete-article/:id', isLoggedIn, articleController.deleteArticle);

//Comment Routes
router.get('/comments', isLoggedIn, commentController.allComments);

module.exports = router;