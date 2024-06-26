const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * GET /
 * Home Page
 */
exports.homePage = async (req, res) => {
  const locals = {
    title: "NodeJs Notes",
    description: "Free NodeJs Notes App."
  };
  res.render('index', {
    locals,
    layout: "../views/layouts/front-page"
  });
};

/**
 * GET /
 * About
 */
exports.about = async (req, res) => {
  const locals = {
    title: "NodeJs Notes | About",
    description: "Free NodeJs Notes App."
  };
  res.render('about', {
    locals
  });
};

/**
 * GET /
 * Sign Up
 */
exports.signup = async (req, res) => {
  const locals = {
    title: "NodeJs Notes | Sign Up",
    description: "Free NodeJs Notes App."
  };
  res.render('signup', {
    locals
  });
};

/**
 * POST
 * SignUp
 */
exports.userSignUp = async (req, res) => {
  try {
    // Retrieve form data from request body
    const {
      firstname,
      lastname,
      username,
      password
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      firstname,
      lastname,
      username,
      password: hashedPassword
    });

    await User.create(newUser);

    req.session.user = newUser;
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
  }
};

/**
 * GET /
 * Login
 */
exports.login = async (req, res) => {
  const locals = {
    title: "NodeJs Notes | Login",
    description: "Free NodeJs Notes App."
  };
  res.render('login', {
    locals
  });
};

/**
 * Post /
 * Check login 
 */
exports.userLogin = async (req, res) => {
  try {
    // Retrieve username and password from request body
    const {
      username,
      password
    } = req.body;

    // Find user by username
    const user = await User.findOne({
      username
    });

    // If user not found, return error
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Compare passwords
    const ispasswordValid = await bcrypt.compare(password, user.password);

    if (!ispasswordValid)
      return res.status(401).json({
        message: 'Invalid Password.'
      });

    req.session.user = user;
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};