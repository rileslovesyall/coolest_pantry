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
    navbarHtml += "<a class='login nav-link'>Login</a> / ";
    navbarHtml += "<a class='signup nav-link'>Sign Up</a>";
  }

  if (localStorage.token !== undefined) {
    navbarHtml += "<a class='pantry-link nav-link'>My Pantry</a> / ";
    navbarHtml += "<a class='add-item nav-link'>Add Item</a> / ";
    navbarHtml += "<a class='logout nav-link'>Logout</a>";
  }

  $('.navbar').html(navbarHtml);
};

var setFooter = function () {
  var footerHtml = "<p>&copy; Riley Spicer 2016 -- <a href='http://rileyspicer.com' >rileyspicer.com</a> -- Ada Developer's Academy Capstone Project</p>";
  $('.footer').html(footerHtml);
};

//
//  FORM METHODS
//

var displayAddItemForm = function (id) {
  var formHtml =
    "<form class='addForm'>" +
      "<fieldset class='form-group'>" +
        "<label for='name'>Name: </label>" +
        "<input class='form-control' for='name' id='name' type='text' name='name' required>" +
        "<label for='description'>Description </label>" +
        "<input class='form-control for='description' id='description' name='description'>" +
        "<label for='portion-size'>Portion Size: </label>" +
        "<div class='form-note'>(i.e. Gallon, Quart, Pint, Cup etc.)</div>" +
        "<input class='form-control' name = 'portion-size' for='portion-size' id='portion-size' required>" +
        "<label for='quantity'>Quantity: </label> " +
        "<input class='form-control' for='quantity' id='quantity' type='number' name='quantity' required>" +
        "<label for='ingredients'>Ingredients: </label>" +
        "<div class='form-note'>(please separate with a comma)</div>" +
        "<input class='form-control' for='ingredients' id='ingredients' name='ingredients'>" +
      "</fieldset>" +
      "<button class='addItem btn btn-default' type='submit'>Submit</button>" +
    "</form>";
  $('.form').html(formHtml);
  $('#header').text('Add an Item');
};

var submitItem = function (type) {
  if (type === 'add') {
    console.log($('.addForm').serialize);
    console.log('add form');
  } else if (type === 'edit') {
    console.log('update form');
  }
};

var displayLoginForm = function () {
  var formHtml =
  "<form>" +
    "<fieldset class='form-group'>" +
      "<label for='email'>Email: </label>" +
      "<input class='form-control' for='email' id='email' name='email' type='email'>" +
      "<label for='password'>Password: </label>" +
      "<input class='form-control' for='password' id='password' name='password' type='password'>" +
    "</fieldset>" +
    "<button class='btn btn-default login'>Submit</button>" +
  "</form>";
  $('.form').html(formHtml);
  $('#header').text('Login');
};

var submitLogin = function () {
  event.preventDefault();
  $.post('http://localhost:9393/api/v1/token',
    $('form').serialize())
  .done(function (data) {
    console.log(data);
    if (data['error'] === undefined) {
      localStorage.token = data['token'];
      localStorage.uid = data['uid'];
      localStorage.name = data['name'];
      document.location.href = '../lib/pantry.html';
    } else {
      console.log(data['error']);
    }
  })
  .fail(function (data){
    console.log(data);
    console.log('This failed. I should probably do something different here.');
  });
};


$(document).ready(function () {

  setHead();
  setNavbar();
  setFooter();

  $('.flash').hide();

  $('.navbar').on('click', '.login', function () {
    $('.pantry').hide();
    $('.pantryitem').hide();
    $('.form').show();
    displayLoginForm();
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
    $('.pantry').hide();
    $('.pantryitem').hide();
    $('.item-form').show();
    displayAddItemForm();
  });

  $('.form').on('click', '.login', function () {
    submitLogin();
  });
  $('.form').on('click', '.addItem', function () {
    submitItem('add');
    $('.form').hide();
  });

});