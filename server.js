// server.js

// require express framework and additional modules
var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

// load environment variables
require('dotenv').load();

// create express app object
var app = express();

// connect to database and pull in model(s)
mongoose.connect('mongodb://localhost/cookies-sessions');
var User = require('./models/user');

// middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');

// tell app to use cookieParser
// this is needed because express-session creates sessions that are stored as cookies
app.use(cookieParser({
    secret: process.env.COOKIE_SECRET
}));

app.use(session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 30 * 60 * 1000
    }
}));

// use bodyParser to decode URL encoded forms
app.use(bodyParser.urlencoded({
    extended: true
}));

// middleware function to verify a session with a userId exists
function verifyUserInSession(req, res, next) {
  console.log("The current session information is:\n\n", req.session);
  if (req.session.userId) {
    console.log("the current user has an id of: ", req.session.userId);
  } else {
    console.log("No userId present in session, redirecting to login.");
    res.redirect('/login')
  }
  next()
}
////////////////
// Routes requiring a session
////////////////
app.get('/forms', verifyUserInSession, function(req, res) {
  var formCookie = req.cookies;
  var formSession = req.session;
  res.render('forms', {cookie: formCookie, session: formSession});
})

app.post('/cookie-form', function(req, res) {
  var cookieForm = req.body;
  req.cookie("dough", cookieForm.dough);
  req.cookie('ingredient', cookieForm.ingredient);
  res.json("Cookies updated, check your cookies");
})

app.post('/session-form', function(req, res) {
  var sessionForm = req.body;
  req.session.location = sessionForm.location;
  req.session.duration = sessionForm.duration;
  res.json(req.session);
})

////////////
// Open routes
////////////

// show the signup form
app.get('/signup', function(req, res) {
    res.render('signup');
});

// create a user
app.post('/users', function(req, res) {
    console.log(req.body);
    User.createSecure(req.body.email, req.body.password, function(err, newUser) {
        req.session.userId = newUser._id;
        res.redirect('/profile');
    });
});

// show the login form
app.get('/login', function(req, res) {
    res.render('login');
});

// authenticate the user and set the session
app.post('/sessions', function(req, res) {
    // call authenticate function to check if password user entered is correct
    User.authenticate(req.body.email, req.body.password, function(err, loggedInUser) {
        if (err) {
            console.log('authentication error: ', err);
            res.status(500).send();
        } else {
            console.log('setting session user id ', loggedInUser._id);
            req.session.userId = loggedInUser._id;
            res.redirect('/profile');
        }
    });
});

// show user profile page
app.get('/profile', verifyUserInSession, function(req, res) {
    console.log('session user id: ', req.session.userId);
    // find the user currently logged in
    User.findOne({
        _id: req.session.userId
    }, function(err, currentUser) {
        if (err) {
            console.log('database error: ', err);
            res.redirect('/login');
        } else {
            // render profile template with user's data
            console.log('loading profile of logged in user');
            res.render('user-show.ejs', {
                user: currentUser
            });
        }
    });
});

app.get('/logout', function(req, res) {
    // remove the session user id
    req.session.userId = null;
    // redirect to login
    res.redirect('/login');
});

// listen on port 3000
app.listen(3000, function() {
    console.log('server started on locahost:3000');
});