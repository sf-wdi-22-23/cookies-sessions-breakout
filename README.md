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


### Here's the plan

- Cookies: edit cookies in the browser, set them in the server, clear them from client, show how cookies maintain state

- Sessions: create session in the server, show the session cookie in client, show sessions maintaining state

**Stretch**
- localStorage and sessionStorage: show how to get and set local and session storage