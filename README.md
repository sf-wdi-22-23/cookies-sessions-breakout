# Cookies and Sessions

| Objectives |
| :--- |
| Store cookies in browser |
| Store user information in a session cookie |
| Show how to clear cookies and sessions |

## What are Cookies and Sessions?

- **Cookies** are small snippets of text, used as key-value pairs. Cookies are used to track state in web applications. Example uses include: remembering you as a user so you don't have to log in every time you visit a site, remembering what is in your shopping cart, remembering where you were in the process of completing a form.
- **Sessions** are server-side based methods of tracking state. A session can be stored in the client as an encrypted cookie. However, it cannot be manipulated directly from the client, so it is more secure.

## Why use cookies and sessions?

Because the HTTP request/response cycle of the Internet is stateless, browsers and servers need help "remembering" what context. Without cookies, sessions, or other methods of passing state, it would be a challenge to let users be "logged-in" or use a shopping cart.

By creating this approximation of "state" in a stateless medium, developers can provide users with a better experience.

## Implementing Cookies and Sessions

To use cookies and sessions, we'll need:

- **Express:** for building our application and handling requests
- **Middleware:**
  * `cookie-parser`: for reading and writing cookies
  * `express-session`: for setting sessions and cookies


### Here's the plan

**Cookies:**
- edit cookies in the browser
- set them in the server
- clear them from client
- show how cookies maintain state

```js
// setting / modifying a cookie in the Dev Tools console
document.cookie = "someKey=someValue";

// setting a cookie in the server
app.get('/cookie', function(req, res) {
  // set value of the cookie with a key of 'ingredient' to be 'vanilla'
  res.cookie("ingredient", 'vanilla');
  // rest of your server side code, for example:
  res.json(req.cookies.ingredient);
})

// clearing a cookie in the server
app.get('/no-cookie', function(req, res) {
  // clear the cookie
  res.clearCookie('ingredient', {path: '/'});
  // send back all remaining cookies
  res.json(req.cookies);
})
```

**Sessions:**
- create session in the server
- show the session cookie in client
- show sessions maintaining state


`scripts.js`
```js
$('#session-form').on('submit', function(e) {
    e.preventDefault();
    console.log("submitted session form");
    var formData = $(this).serialize();

    $.post('/session-form', formData, function(response) {
        console.log("server response is: ", response);
        window.location.href = "/forms";
    })
})
```

`server.js`
```js
// post info to the session object
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
```

`forms.ejs`
```html
<!-- redirect / render this form with session info if there is any -->
<form id="session-form">
  <label for="location">Location</label>
  <input class="form-control" type="text" name="location">
  <label for="duration">Duration</label>
  <input class="form-control" type="text" name="duration">
  <input class="form-control btn btn-primary" type="submit">
  <div id="current-session">
    <h2>Server side information:</h2>
    <p>Current session location is: <%= session.location %></p>
    <p>Current session duration is: <%= session.duration %></p>
  </div>
</form>
```

**Stretch: localStorage and sessionStorage**

Setting localStorage or sessionStorage values in the browser (or in your client-side Javascript files).

```js
// localStorage
localStorage.setItem('WDI', '23'); // sets a key-value pair in localStorage
localStorage.getItem('WDI'); // "23"
localStorage.removeItem('wdi'); // removes an item from localStorage
localStorage.clear(); // remove all items from localStorage

// sessionStorage
sessionStorage.setItem('WDI', '23'); // sets a key-value pair in sessionStorage
sessionStorage.getItem('WDI'); // "23"
sessionStorage.removeItem('wdi'); // removes an item from sessionStorage
sessionStorage.clear(); // remove all items from sessionStorage
```