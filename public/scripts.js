console.log('sanity check: client-side js loaded');

$(document).ready(function() {
  $('#session-form').on('submit', function(e) {
    e.preventDefault();
    console.log("submitted session form");
    var formData = $(this).serialize();

    $.post('/session-form', formData, function(response) {
      console.log("server response is: ", response);
    })
  })

  $('#cookie-form').on('submit', function(e) {
    e.preventDefault();
    console.log("submitted cookie form");
    var formData = $(this).serialize();

    $.post('/cookie-form', formData, function(response) {
      console.log("server response is: ", response);
    })
  })
  // $('#signup-form').on('submit', function(e) {
  //   e.preventDefault();

  //   // select the form and serialize its data
  //   var signupData = $("#signup-form").serialize();
  //   console.log(signupData);
  //   // send POST request to /users with the form data
  //   $.post('/users', signupData, function(response) {
  //     console.log(response);
  //   });
  // });

  // $('#login-form').on('submit', function(e) {
  //   e.preventDefault();

  //   // select the form and serialize its data
  //   // note: this is the form because the event handler
  //   //   was triggered from the form
  //   var loginData = $(this).serialize();
  //   // send POST request to /login with the form data
  //   $.post('/login', loginData, function(response) {
  //     console.log(response);
  //   });
  // });

});
