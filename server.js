// server.js

// require express framework and additional modules
var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

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
app.use(cookieParser());

app.use(session({
    key: 'connect.sid', // default value
    secret: "secretstuff",
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

////////////////
// Routes requiring a session
////////////////
app.get('/forms', function(req, res) {
    console.log("req.cookies:\n ", req.cookies, "\nreq.session:\n ", req.session);
    var formCookie = req.cookies;
    var formSession = req.session;
    // console.log("CURRENT SESSION COOKIE is:\n ", req.cookies['connect.sid']);
    res.render('forms', {
        cookie: formCookie,
        session: formSession
    });
})

// app.get('/cookie', function(req, res) {
//   // set value of the cookie with a key of 'ingredient' to be 'vanilla'
//   res.cookie("ingredient", 'vanilla');
//   // rest of your server side code, for example:
//   res.json(req.cookies.ingredient);
// })

// app.get('/no-cookie', function(req, res) {
//   // clear the cookie
//   res.clearCookie('ingredient', {path: '/'});
//   // send back all remaining cookies
//   res.json(req.cookies);
// })

app.post('/cookie-form', function(req, res) {
    console.log("cookie form data is: ", req.body);

    var dough = req.body.dough || "";
    var ingredient = req.body.ingredient || "";
    res.cookie("dough", dough);
    res.cookie('ingredient', ingredient);

    console.log("response cookies are: ", res.cookies);
    // res.redirect('/forms'); // not using b/c redirecting via client
    res.json({
        cookies: res.cookies,
        session: req.session
    })
})

app.post('/session-form', function(req, res) {
    var sessionForm = req.body;
    console.log("session form data is: ", sessionForm);
    req.session.location = sessionForm.location || "";
    req.session.duration = sessionForm.duration || "";
    // res.redirect('/forms'); // not using b/c redirecting via client
    res.json({
        cookies: res.cookies,
        session: req.session
    })
})

app.post('/long-form', function(req, res) {
  // setting up object to provide default values for cookies
  // this will populate the EJS form
  // can be used for if a user accidentally navigates away from the page
    var data = {
        foo: req.body.foo || "",
        bar: req.body.bar || "",
        baz: req.body.baz || "",
        how: req.body.how || "",
        what: req.body.what || "",
        when: req.body.when || "",
    }
    // setting a cookie with name of key and value of that key's value
    for (key in data) {
        res.cookie(key, data[key]);
    }
    res.json(data);
})

app.delete('/clear', function(req, res) {
    for (key in req.cookies) {
        res.clearCookie(key, { path: '/'});
    }
    console.log("SESSION COOKIE BEING DELETED", req.cookies['connect.sid']);
    res.clearCookie('connect.sid', {path: '/'});
    // remove the session
    req.session = null;

    res.json("cookies and sessions deleted");
});

// listen on port 3000
app.listen(3000, function() {
    console.log('server started on locahost:3000');
});