require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const methodOverride = require('method-override');
const passport = require('passport');
const mongoStore = require('connect-mongo');
const session = require('express-session');

const app = express();
const PORT = 5000 | process.env.PORT;

// Use express-session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: mongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  // cookie: {
  //   maxAge: new Date(Date.now() + (3600000))
  // }
}));

// Initialize Passport middleware after express-session
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.use(methodOverride('_method'));

// Connect to database
connectDB();

// Static files
app.use(express.static('public'));

// templating engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));

// Handle 404
app.get('*', (req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`App listening on port: http://localhost:${PORT}`);
});