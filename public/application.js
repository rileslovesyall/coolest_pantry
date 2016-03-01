var setHead = function() {
  $('head').append(
      "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css' integrity='sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7' crossorigin='anonymous'>"+
      "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js' integrity='sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS' crossorigin='anonymous'></script>"+
      "<link href='https://fonts.googleapis.com/css?family=Special+Elite|Nixie+One' rel='stylesheet' type='text/css'>"+
      "<link rel='stylesheet' href='../public/style/application.css'>"
    );
};

var setNavbar = function () {
  var navbarHtml = "";

  if (localStorage.token === undefined) {
    navbarHtml += "<a class='login nav-link'>Login / </a>";
    navbarHtml += "<a class='signup nav-link'>Sign Up</a>";
  }

  if (localStorage.token !== undefined) {
    navbarHtml += "<a class='pantry-link nav-link'>My Pantry / </a>";
    navbarHtml += "<a class='add-item nav-link'>Add Item / </a>";
    navbarHtml += "<a class='logout nav-link'>Logout</a>";
  }

  $('.navbar').html(navbarHtml);
};

var setFooter = function () {
  var footerHtml = "<p>&copy; Riley Spicer 2016 -- <a href='http://rileyspicer.com' >rileyspicer.com</a> -- Ada Developer's Academy Capstone Project</p>";
  $('.footer').html(footerHtml);
};


$(document).ready(function () {

  setHead();
  setNavbar();
  setFooter();

  $('.navbar').on('click', '.login', function () {
    document.location.href = '../lib/login.html';
  });
  $('.navbar').on('click', '.signup', function () {
    document.location.href = '../lib/signup.html';
  });
  $('.navbar').on('click', '.logout', function () {
    localStorage.clear();
    document.location.href = '../lib/index.html';
  });
  $('.navbar').on('click', '.pantry-link', function () {
    document.location.href = '../lib/pantry.html';
  });
  $('.navbar').on('click', '.add-item', function () {
    document.location.href = '../lib/pantryitem.html';
  });

});