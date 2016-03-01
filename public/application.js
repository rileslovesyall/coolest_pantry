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
    navbarHtml += "<a class='login'>Login</a> / ";
  }

  navbarHtml += "<a class='pantry-link'>My Pantry</a> / ";
  navbarHtml += "<a class='add-item'>Add Item</a> / ";

  if (localStorage.token !== undefined) {
    navbarHtml += "<a class='logout'>Logout</a>";
  }

  $('.navbar').html(navbarHtml);
};


$(document).ready(function () {

  setHead();
  setNavbar();

  $('navbar').on('click', '.logout', function () {

  });
  $('navbar').on('click', '.login', function () {

  });
  $('navbar').on('click', '.pantry', function () {

  });
  $('navbar').on('click', '.add-item', function () {

  });

});