exports.isLoggedIn = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    return res.status(401).send('Access Denied');
  }
};