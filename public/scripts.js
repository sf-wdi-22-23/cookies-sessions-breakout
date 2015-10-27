console.log('sanity check: client-side js loaded');

$(document).ready(function() {
    $('#session-form').on('submit', function(e) {
        e.preventDefault();
        console.log("submitted session form");
        var formData = $(this).serialize();

        $.post('/session-form', formData, function(response) {
            console.log("server response is: ", response);
            window.location.href = "/forms";
        })
    })

    $('#cookie-form').on('submit', function(e) {
        e.preventDefault();
        console.log("submitted cookie form");
        var formData = $(this).serialize();

        $.post('/cookie-form', formData, function(response) {
            console.log("server response is: ", response);
            window.location.href = "/forms";
        })
    })

    $('#long-form').on('submit', function(e) {
        e.preventDefault();
        console.log("submitted session form");
        var formData = $(this).serialize();

        $.post('/long-form', formData, function(response) {
            console.log("server response is: ", response);
            window.location.href = "/forms";
        })
    })

    $('#clear').on('click', function(e) {
        e.preventDefault();
        console.log("clearing cookies and sessions");
        $.ajax({
            url: '/clear',
            type: 'delete'
        })
            .done(function(response) {
                console.log(response);
                localStorage.clear();
                sessionStorage.clear();
            })
        window.location.href = "/forms";
    })

    $('#sessionStorage').text(sessionStorage.getItem('foo') || "Nothing in localStorage.foo!");
    $('#localStorage').text(localStorage.getItem('bar') || "Nothing in sessionStorage.bar!");

});