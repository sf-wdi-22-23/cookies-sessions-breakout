# Authentication with Express & Bcrypt

| Objectives |
| :--- |
| Store cookies in browser |
| Store user information in a session cookie |
| Show how to clear cookies and sessions |

## Cookies and Sessions

- **Cookies** are
- **Sessions** are

## Why use cookies and sessions?

Because the HTTP request/response cycle of the Internet is stateless, browsers and servers need help "remembering" what context. Without cookies, sessions, or other methods of passing state, it would be a challenge to let users be "logged-in" or use a shopping cart.

By creating this approximation of "state" in a stateless medium, developers can provide users with a better experience.

## Implementing Cookies and Sessions

To use cookies and sessions, we'll need:

- **Express:** for building our application and handling requests
- **Middleware:**
  * `cookie-parser`: for reading and writing cookies
  * `express-session`: for setting sessions and cookies


###Here's the plan

- Cookies

- Sessions

- Stretch: localStorage and sessionStorage


## 1. Create a new Node/Express project.

1. In the terminal, initialize a new Node project, and install `express` and `body-parser`.

  ```
  $ mkdir simple-login
  $ cd simple-login
  $ touch server.js
  $ npm init
  $ npm install --save express body-parser mongoose ejs
  ```

2. Open your project in Sublime, and set up your server in `server.js` with the following code snippet:

  ```js
  // server.js

  // require express framework and additional modules
  var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

  // middleware
  app.use(express.static('public'));
  app.set('view engine', 'ejs');
  app.use(bodyParser.urlencoded({extended: true}));
  mongoose.connect('mongodb://localhost/simple-login');


  // signup route with placeholder response
  app.get('/signup', function (req, res) {
    res.send('signup coming soon');
  });

  // login route with placeholder response
  app.get('/login', function (req, res) {
    res.send('login coming soon');
  });

  // listen on port 3000
  app.listen(3000, function () {
    console.log('server started on locahost:3000');
  });
  ```

3. In the terminal, run `nodemon` and make sure your server starts without any errors. If you get an error in your Terminal, read the line number and error message. Most likely, you're trying to use an undefined variable or a module that's not installed. Visit `/login` and `/signup` in your browser to make GET requests to those paths. Verify that those routes are sending back the messages you expect.

  ```
  $ nodemon
  ```

  **Note:** Keep `nodemon` running the entire time you're developing your application. When you need to execute other terminal commands, press `command + T` to open a new terminal tab.

## 2. Set up sessions and cookies to keep track of logged-in users.

1. In the Terminal, install `express-session`.

  ```
  $ npm install --save express-session
  ```

2. In `server.js`, require `express-session` and set the session options. <a href="https://github.com/expressjs/session#options" target="_blank">Read more about the session options.</a>

  ```js
  // server.js
  var session = require('express-session');

  // middleware (new addition)
  // set session options
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'SuperSecretCookie',
    cookie: { maxAge: 30 * 60 * 1000 } // 30 minute cookie lifespan (in milliseconds)
  }));
  ```

1. Now that the session is defined, let's start keeping data in a session when someone signs up or logs in by setting `req.session.userId` to the user's id. This would go just before the `res` line of your `POST /sessions` route.

  ```js
      req.session.userId = user._id;
  ```

1. After authenticating a user, and loggin them in, we don't want to just send back JSON or a message. They should see site content.  Create a simple profile view.  You could call the view template file `profile.ejs` or `user-show.ejs`. There's boilerplate below. Take a minute to look it over - notice where it's using ejs templating.

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- bootstrap css -->
    <link type="text/css" rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script src="scripts.js"></script>

    <title>Simple Login</title>
  </head>
  <body>
    <div class="container text-center">
      <div class="row">
        <div class="col-md-6 col-md-offset-3">
          <h1>Profile</h1>
          <hr>
          <h2>Welcome! You're logged in as <%= user.email %>.</h2>
        </div>
      </div>
    </div>
  </body>
  </html>
  ```

2. Create a route to render this profile view at `GET` `/profile`.

  ```js
  // server.js

  // show user profile page
  app.get('/profile', function (req, res) {
    // find the user currently logged in
    User.findOne({_id: req.session.userId}, function (err, currentUser) {
      res.render('user-show.ejs', {user: currentUser})
    });
  });
  ```

1. Modify the `POST /sessions` route to redirect to the user's profile page using `res.redirect('/profile');` instead of its current response.

1. Test the effect of your modification in the browser. What do you see on the page and in the console?

1. It turns out AJAX doesn't play well with redirects. They're changing your browser in two fundamentally different ways. The AJAX requests we've been making in our client-side JavaScript were helpful for debugging as we set everything up, but now that we want to redirect, we need to move back to non-AJAX requests.

1. Update your `login.ejs` so that the form has a `method` and `action`. Remove the AJAX call for the login form from your scripts.js.  Test your login form again.


1. We don't want new users to get a JSON or message response when they sign up, either. In fact, we probably want to log them in automatically. Modify the `POST /users` route to save a new user's id in the session and then redirect to the profile. Also modify your signup form to use `method` and `action`.

## 7. Enable logout

1. On the profile view, add a logout link.


  ```html
  <!-- profile.ejs -->
  <h1>Profile</h1>
  <hr>
  <h2>Welcome! You're logged in as <%= user.email %>.</h2>
  <a id="logout" href="/logout" class="btn btn-default">Log Out</a>
  ```

1. Make a `GET /logout` route on your server that logs out a user by setting the  `req.session.userId` to `null`, then redirects to the login page.

  ```js

  //server.js
  app.get('/logout', function (req, res) {
    // remove the session user id
    req.session.userId = null;
    // redirect to login (for now)
    res.redirect('/login');
  });
  ```

## 8. Error Handling

Things don't always go right, and we need our apps to respond nicely when they don't. Here are some strategies.

1. Upon login, if a password is not correct, respond with an error message and display it on the client. Remember to use the bootstrap `.alert` and `.alert-warning` classes.
1. Upon login, if a user is not found, respond with an error message and display it on the client.
1. Upon signup, make sure passwords are at least 6 characters long. Return and display an error if this is false.
1. Is there a way to refactor your client- or server-side code to generalize these two examples of error handling?


## Custom Middleware Refactor (Stretch)

1. Let's refactor our lookup of the current user into some custom middleware to find the current user so we will always have it available.

  ```js
    // server.js
    // custom middleware - should go before routes
    // adds a currentUser method to the request (req) that can find the user currently logged in based on the request's `session.userId`
    app.use('/', function (req, res, next) {
      req.currentUser = function (callback) {
        User.findOne({_id: req.session.userId}, function (err, user) {
          if (!user) {
            callback("No User Found", null)
          } else {
            req.user = user;
            callback(null, user);
          }
        });
      };

      next();
    });
  ```

1. Modify your logout route so that it also sets `req.user` to `null`.

5. The `req.currentUser` middleware finds the user who is currently logged in. You can use `req.currentUser` to *authorize* parts of your site.
  * Logged-in users should NOT be able to see the `/signup` or `/login` pages.
  * Users should only be able to see `/profile` when logged in.

  **Hint:** You'll need to add some logic when calling `req.currentUser` to check if a logged-in user was found. You'll want to use `res.redirect` if a user tries to perform an unauthorized action.


