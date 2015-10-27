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
    console.log("req.cookies: ", req.cookies, "req.session: ", req.session);
    var formCookie = req.cookies;
    var formSession = req.session;
    res.render('forms', {
        cookie: formCookie,
        session: formSession
    });
})

app.post('/cookie-form', function(req, res) {
    console.log("req.body is: ", req.body)
    var dough = req.body.dough || "";
    var ingredient = req.body.ingredient || "";
    console.log(dough, ingredient);
    res.cookie("dough", dough);
    res.cookie('ingredient', ingredient);
    console.log("response cookies are: ", res.cookies);
    // res.redirect('/forms'); // redirecting via client
    res.json({
        cookies: res.cookies,
        session: req.session
    })
})

app.post('/session-form', function(req, res) {
    var sessionForm = req.body;
    req.session.location = sessionForm.location || "";
    req.session.duration = sessionForm.duration || "";
    // res.redirect('/forms'); // redirecting via client
    res.json({
        cookies: res.cookies,
        session: req.session
    })
})

app.post('/long-form', function(req, res) {
    var data = {
        foo: req.body.foo || "",
        bar: req.body.bar || "",
        baz: req.body.baz || "",
        how: req.body.how || "",
        what: req.body.what || "",
        when: req.body.when || "",
    }

    for (key in data) {
        res.cookie(key, data[key]);
    }
    res.json(data);
})

app.delete('/clear', function(req, res) {
    for (key in req.cookies) {
        res.clearCookie(key, { path: '/'});
    }
    res.clearCookie('connect.sid', {path: '/'});
    // remove the session
    req.session = null;

    res.json("cookies and sessions deleted");
});

// listen on port 3000
app.listen(3000, function() {
    console.log('server started on locahost:3000');
});