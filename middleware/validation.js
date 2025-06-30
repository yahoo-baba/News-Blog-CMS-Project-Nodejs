const { body } = require('express-validator')

const loginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .matches(/^\S+$/)
    .withMessage('Username must not contain spaces')
    .isLength({ min: 5, max: 12 })
    .withMessage('Username must be 5 to 10 characters long'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 5 , max: 12 })  
    .withMessage('Password must be 5 to 12 characters long')
]

const userValidation = [
  body('fullname')
    .trim()
    .notEmpty()
    .withMessage('Fullname is required')
    .isLength({ min: 5, max: 25 })
    .withMessage('Fullname must be 5 to 25 characters long'),

  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .matches(/^\S+$/)
    .withMessage('Username must not contain spaces')
    .isLength({ min: 5, max: 12 })
    .withMessage('Username must be 5 to 10 characters long'),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 5 , max: 12 })  
    .withMessage('Password must be 5 to 12 characters long'),

  body('role')
    .trim()
    .notEmpty()  
    .withMessage('Role is required')
    .isIn(['author', 'admin'])
    .withMessage('Role must be author or admin')
]

const userUpdateValidation = [
  body('fullname')
    .trim()
    .notEmpty()
    .withMessage('Fullname is required')
    .isLength({ min: 5, max: 25 })
    .withMessage('Fullname must be 5 to 25 characters long'),

  body('password')
    .optional({ checkFalsy: true})
    .isLength({ min: 5 , max: 12 })  
    .withMessage('Password must be 5 to 12 characters long'),

  body('role')
    .trim()
    .notEmpty()  
    .withMessage('Role is required')
    .isIn(['author', 'admin'])
    .withMessage('Role must be author or admin')
]

const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category Name is required')
    .isLength({ min:3, max:12})
    .withMessage('Category Name must be 3 to 12 characters long'),

  body('description')
    .isLength({max:100})
    .withMessage('Description must be at most 100 characters long')
]

const articleValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 7, max: 50 })
    .withMessage('Title must be 7 to 50 characters long'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 50, max: 1500 })
    .withMessage('Content must be 50 to 1500 characters long'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')

]

module.exports = { 
  loginValidation,
  userValidation,
  userUpdateValidation,
  categoryValidation,
  articleValidation

 }