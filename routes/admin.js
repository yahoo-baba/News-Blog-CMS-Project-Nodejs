const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedin');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/multer');

const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const UserController = require('../controllers/userController');

//Login Routes
router.get('/', UserController.loginPage);
router.post('/index', UserController.adminLogin);
router.get('/logout',  isLoggedIn, UserController.logout);
router.get('/dashboard', isLoggedIn, UserController.dashboard);
router.get('/settings', isLoggedIn, isAdmin, UserController.settings);
router.post('/save-settings', isLoggedIn, isAdmin, upload.single('website_logo') ,UserController.saveSettings);

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
router.post('/add-article', isLoggedIn, upload.single('image') ,articleController.addArticle);
router.get('/update-article/:id', isLoggedIn, articleController.updateArticlePage);
router.post('/update-article/:id', isLoggedIn, upload.single('image') ,articleController.updateArticle);
router.delete('/delete-article/:id', isLoggedIn, articleController.deleteArticle);

//Comment Routes
router.get('/comments', isLoggedIn, commentController.allComments);

// 404 Middleware
router.use(isLoggedIn,(req, res, next) => { 
  res.status(404).render('admin/404',{
    message: 'Page not found',
    role: req.role 
  })
});

// 500 Error Handler
router.use(isLoggedIn, (err, req, res, next) => { 
  console.error(err.stack);
  const status = err.status || 500;
  let view;
  switch (status) {
    case 401:
      view = 'admin/401';
      break;
    case 404:
      view = 'admin/404';
      break;
    case 500:
      view = 'admin/500';
      break;
    default:
      view = 'admin/500';
  }
  res.status(status).render(view,{
    message: err.message || 'Something went wrong',
    role: req.role 
  })
});

// router.use(isLoggedIn, (err, req, res, next) => { 
//   console.error(err.stack);
//   res.status(500).render('admin/500',{
//     message: err.message || 'Internal Server Error',
//     role: req.role 
//   })
// });

module.exports = router;