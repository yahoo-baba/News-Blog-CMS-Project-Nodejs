const isAdmin = (req, res, next) => {
  if (req.role === 'admin') {
    next();
  } else {
    res.redirect('/admin/dashboard');
  }
}

module.exports = isAdmin