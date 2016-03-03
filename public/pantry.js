//
// HTML SETUP METHODS
//

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
// HELPER METHODS
// 

var cleanDate = function(dateString) {
  var date = new Date(dateString);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  return month + '/' + day + '/' + year;
};

var storeEachToLocalStorage = function (pantryitemArr) {
  for (var i = 0; i < pantryitemArr.length; i++) {
    var item = pantryitemArr[i];
    localStorage.setItem('pantryitem' + item['id'], JSON.stringify(item));
  }
};

//
//  FORM METHODS
//

var displayAddItemForm = function (id) {
  var formHtml =
    "<form class='add-form'>" +
      "<fieldset class='form-group'>" +
        "<label for='name'>Name: </label>" +
        "<input class='form-control' for='name' id='name' type='text' name='name' required>" +
        "<label for='description'>Description </label>" +
        "<input class='form-control for='description' id='description' name='description'>" +
        "<label for='portion'>Portion Size: </label>" +
        "<div class='form-note'>(i.e. Gallon, Quart, Pint, Cup etc.)</div>" +
        "<input class='form-control' name = 'portion' for='portion' id='portion' required>" +
        "<label for='quantity'>Quantity: </label> " +
        "<input class='form-control' for='quantity' id='quantity' type='number' name='quantity' required>" +
        "<label for='ingredients'>Ingredients: </label>" +
        "<div class='form-note'>(please separate with a comma)</div>" +
        "<input class='form-control' for='ingredients' id='ingredients' name='ingredients'>" +
      "</fieldset>" +
      "<button class='submit-add-item btn btn-default'>Submit</button>" +
    "</form>";
  $('.form-holder').show();
  $('.form-holder').html(formHtml);
  $('#header').text('Add an Item');
};

var submitItem = function (type) {
  var token = localStorage.getItem('token');
  event.preventDefault();
  if (type === 'add') {
    console.log($('.add-form').serialize());
    $.ajax({
      type: 'POST',
      url: 'http://localhost:9393/api/v1/pantryitems',
      headers: {'Authorization': token},
      data: $('.add-form').serialize(),
      // dataType: "json",
      success: function(data) {
        console.log(data);
        console.log('succeeded!');
        }
      })
    .done(function (data) {
      $('.form-holder').hide();
      displayPantry();
    })
    .fail (function(data) {
      console.log("Failed");
      console.log(data);
    });
  } else if (type === 'edit') {
    console.log('update form');
  }
};

var displayLoginForm = function () {
  var formHtml =
  "<form class='login-form'>" +
    "<fieldset class='form-group'>" +
      "<label for='email'>Email: </label>" +
      "<input class='form-control' for='email' id='email' name='email' type='email'>" +
      "<label for='password'>Password: </label>" +
      "<input class='form-control' for='password' id='password' name='password' type='password'>" +
    "</fieldset>" +
    "<button class='btn btn-default login-button'>Submit</button>" +
  "</form>";
  $('.form-holder').show();
  $('.form-holder').html(formHtml);
  $('#header').text('Login');
};

var submitLogin = function () {
  event.preventDefault();
  $.post('http://localhost:9393/api/v1/token',
    $('.login-form').serialize())
  .done(function (data) {
    console.log(data);
    if (data['error'] === undefined) {
      localStorage.token = data['token'];
      localStorage.uid = data['uid'];
      localStorage.name = data['name'];
      setNavbar();
      $('.form-holder').hide();
      displayPantry();
    } else {
      console.log(data['error']);
    }
  })
  .fail(function (data){
    console.log(data);
    console.log('This failed. I should probably do something different here.');
  });
};

var displaySignupForm = function () {
  var formHtml = "<form class='signup-form'>" +
    "<fieldset class='form-group'>" +
      "<label for='name'>Name: </label>" +
      "<input class='form-control' for='name' id='name' name='name' type='text'>" +
      "<label for='email'>Email: </label>" +
      "<input class='form-control' for='email' id='email' name='email' type='email'>" +
      "<label for='password'>Password: </label>" +
      "<input class='form-control' for='password' id='password' name='password' type='password'>" +
      "<label for='password_confirmation'>Password Confirmation: </label>" +
      "<input class='form-control' for='password_confirmation' id='password_confirmation' name='password' type='password'>" +
    "</fieldset>" +
    "<button class='btn btn-default signup-button'>Sign Up</button>" +
  "</form>";
  $('.form-holder').show();
  $('.form-holder').html(formHtml);
  $('#header').text('Sign Up');
};

var submitSignup = function () {
  event.preventDefault();
  $.post('http://localhost:9393/api/v1/users',
    $('.signup-form').serialize())
  .done(function (data) {
    console.log(data);
    if (data['error'] === undefined) {
      localStorage.token = data['user']['api_token'];
      localStorage.uid = data['user']['id'];
      localStorage.name = data['user']['name'];
      $('.form-holder').hide();
      setNavbar();
      displayPantry();
    } else {
      console.log(data['error']);
    }
  })
  .fail(function (data){
    console.log('failed');
  });
};

// 
// PANTRY DISPLAY METHODS
// 

var displayPantry = function () {
  $('.pantry').show();
  $('.pantry').html("<div class='loading-message'>Hold tight. Your pantry is loading.</div>");
  $('#header').text(localStorage.getItem('name') + "'s Pantry");
  if (localStorage.getItem('pantryitems') !== null) {
    loadPantryLocalStorage();
  }
  loadPantryAPI();
};

var loadPantryLocalStorage = function () {
  var items = JSON.parse(localStorage.getItem('pantryitems'));
  var tempHtml = "";
  tempHtml += "<table class='table table-responsive table-hover' id='pantry-table'><th>Item</th><th>Portion Size</th>" +
  "<th>Quantity</th><th>Consume</th><th>Exp. Date</th>";
  for (i=0; i<items.length;i++) {
    var item = items[i];
    var expDate = cleanDate(item['expiration_date']);
      tempHtml += "<tr>" +
          "<td class='item_name td-not-button' id="+item['id']+">" + "<a>"+item["name"]+'</a>' + "</td>" +
          "<td class='portion-size td-not-button' id="+item['id']+">" + item["portion"] + "</td>" +
          "<td class='quantity td-not-button' id="+item['id']+">" + item["quantity"] + "</td>" +
          "<td class='consume' id="+item['id']+">" + "<button class='btn btn-default'> -1 </button" + "</td>" +
          "<td class='exp-date td-not-button' id="+item['id']+">" + expDate + "</td>" +
          "</tr>";
  }
  tempHtml += "</table>";
  $('.pantry').html(tempHtml);
};

var loadPantryAPI = function () {
  var uid = localStorage.uid;
  var token = localStorage.token;

  $.ajax({
    type:"GET",
    headers: {'Authorization': token},
    url: "http://localhost:9393/api/v1/users/" + uid + "/personal_pantry",
    success: function(data) {
      var length = data['pantry_items'].length;
      var pantryHtml = "";
      var itemsArr = [];
      pantryHtml += "<table class='table table-responsive table-hover' id='pantry-table'><th>Item</th><th>Portion Size</th>" +
      "<th>Quantity</th><th>Consume</th><th>Exp. Date</th>";
      for (i = 0; i < length; i++) {
        var item  = data['pantry_items'][i];
        itemsArr.push(item);
        var expDate = cleanDate(item['expiration_date']);
        pantryHtml += "<tr>" +
          "<td class='item_name td-not-button' id="+item['id']+">" + "<a>"+item["name"]+'</a>' + "</td>" +
          "<td class='portion-size td-not-button' id="+item['id']+">" + item["portion"] + "</td>" +
          "<td class='quantity td-not-button' id="+item['id']+">" + item["quantity"] + "</td>" +
          "<td class='consume' id="+item['id']+">" + "<button class='btn btn-default'> -1 </button" + "</td>" +
          "<td class='exp-date td-not-button' id="+item['id']+">" + expDate + "</td>" +
          "</tr>";
      }
      if (length === 0) {
        pantryHtml = "<h3>You don't have any items yet. Add some to get started.</h3>";
      } else {
        pantryHtml += "</table>";
      }
      $('.pantry').html(pantryHtml);

      // reset localStorage to most up-to-date data
      localStorage.setItem('pantryitems', JSON.stringify(itemsArr));
      storeEachToLocalStorage(itemsArr);
    }
  })
  .fail(function (data) {
    console.log("Error, this failed.");
    $('.flash').show();
    $('.flash').text("Uh oh, this failed. Please try again.");
  });
  
};

// 
//  SHOW PAGE METHODS
// 

var viewItem = function (id) {
  // ajax call to get latest data
  $.ajax({
    type: "GET",
    url: "http://localhost:9393/api/v1/pantryitems/" + id,
    headers: {'Authorization': localStorage.token},
    success: function (data) {
      var item = data['pantryitem'];
      var description = "";
      if (item['description'] !== null) {
        description += "<div class='pantryitem-show description-show'>" + item['description'] + "</div>";
      }
      var pantryitemHtml = description +
        "<div class='pantryitem-show exp-date-show'> Expiration Date: " + cleanDate(item['expiration_date']) + "</div>" +
        "<div class='pantryitem-show quantity-show' id="+id+"> Available Quantity: " + item['quantity'] + "</div>" +
        "<button class='add btn btn-default sm-button' id="+id+"> Quick Add </button>" +
        "<button class='show-pantry btn btn-default sm-button'> Back to Pantry </button>" +
        "<button class='consume consume-show btn btn-default sm-button' id="+id+"> Consume </button>" +
        "<div class='row'>" +
          "<div class='col-sm-6'><button class='edit btn btn-default big-button' id="+id+">Edit Item</button></div>" +
          "<div class='col-sm-6'><button class='bulk-add btn btn-default big-button' id="+id+">Bulk Add</button></div>" +
        "</div>";
      $('.pantryitem').html(pantryitemHtml);
    }
  })
  .fail(function(data) {
    console.log("Uh oh, this failed.");
  });
  // hide pantry div, display pantryitem div, set loading message / new header
  $('.pantry').hide();
  $('.pantryitem').show();
  $('.pantryitem').html("<div class='loading-message'>Your item is loading.</div>");

  // get current item from local Storage and set header
  var currItem = JSON.parse(localStorage.getItem('pantryitem' + id));
  $('#header').text(currItem['name']);

  // pull info from localStorage
  var description = "";
  if (currItem['description'] !== null) {
    description += "<div class='pantryitem-show description-show'>" + currItem['description'] + "</div>";
  }
  var tempHtml = description +
    "<div class='pantryitem-show exp-date-show'> Expiration Date: " + cleanDate(currItem['expiration_date']) + "</div>" +
    "<div class='pantryitem-show quantity-show' id="+id+"> Available Quantity: " + currItem['quantity'] + "</div>" +
    "<button class='add btn btn-default sm-button' id="+id+"> Quick Add </button>" +
    "<button class='show-pantry btn btn-default sm-button'> Back to Pantry </button>" +
    "<button class='consume consume-show btn btn-default sm-button' id="+id+"> Consume </button>" +
    "<div class='row'>" +
      "<div class='col-sm-6'><button class='edit btn btn-default big-button' id="+id+">Edit Item</button></div>" +
      "<div class='col-sm-6'><button class='bulk-add btn btn-default big-button' id="+id+">Bulk Add</button></div>" +
    "</div>";
  $('.pantryitem').html(tempHtml);
};



var addConsumeItem = function(id, action, quantity) {
  // make AJAX call to check data against API
  $.ajax({
    type: "POST",
    url: "http://localhost:9393/api/v1/pantryitems/" + id + "/" + action ,
    headers: {'Authorization': localStorage.token},
    data: 'quantity=' + quantity,
    success: function (data) {
      if (data['error'] === undefined) {
        $('#'+id+'.quantity').text(data['pantryitem']['quantity']);
        $('#'+id+'.quantity-show').text("Available Quantity: "+ data['pantryitem']['quantity']);
      } else {
        $('.flash').show();
        $('.flash').text(error['message']);
      }
    }
  })
  .fail(function(data) {
    console.log('This failed.');
    $('.flash').show();
    $('.flash').text("Uh oh, this failed. Please try again.");
  });

  // update from localStorage for quicker display
  var currItem = JSON.parse(localStorage.getItem('pantryitem' + id));

  if (action === 'add') {
    currItem['quantity'] += 1;

  } else if (action === 'consume') {
    currItem['quantity'] -= 1;
  }

  localStorage.setItem('pantryitem' + id, JSON.stringify(currItem));

  $('#'+id+'.quantity').text(currItem['quantity']);
  $('#'+id+'.quantity-show').text("Available Quantity: " + currItem['quantity']);
};

// 
// 
// 
//  DOCUMENT READY CODE BELOW
// 
// 
// 

$(document).ready(function () {

  // hide flash div on click if it's been displayed
  $(document).click(function () {
    $('.flash').hide();
  });

  // setup HTML
  setHead();
  setNavbar();
  setFooter();
  $('.flash').hide();

  // load login
  // CHANGE THIS TO BE SPLASH PAGE
  if (localStorage.token) {
    displayPantry();
  } else {
    displayLoginForm();
  }


  // NAVBAR DIV

  $('.navbar').on('click', '.login', function () {
    $('.pantry').hide();
    $('.pantryitem').hide();
    displayLoginForm();
  });

  $('.navbar').on('click', '.signup', function () {
    $('.pantry').hide();
    $('.pantryitem').hide();
    displaySignupForm();
  });

  $('.navbar').on('click', '.logout', function () {
    localStorage.clear();
    $('.pantry').hide();
    $('.pantryitem').hide();
    $('.form-holder').hide();
    setNavbar();
    $('#header').text('Please come again.');
  });

  $('.navbar').on('click', '.pantry-link', function () {
    $('.form-holder').hide();
    $('.pantryitem').hide();
    displayPantry();
  });

  $('.navbar').on('click', '.add-item', function () {
    $('.pantry').hide();
    $('.pantryitem').hide();
    displayAddItemForm();
  });

  // FORM DIV

  $('.form-holder').on('click', '.login-button', function () {
    submitLogin();
  });

  $('.form-holder').on('click', '.signup-button', function () {
    submitSignup();
  });

  $('.form-holder').on('click', '.submit-add-item', function () {
    submitItem('add');
  });

  // PANTRY DIV

  $('.pantry').on('click', '.item_name', function () {
    var id = $(this).attr('id');
    viewItem(id);
  });
  
  $('.pantry').on('click', '.consume', function() {
    var id = $(this).attr('id');
    addConsumeItem(id, 'consume', 1);
  });

  // PANTRYITEM SHOW DIV

  $('.pantryitem').on('click', '.add', function() {
    var id = $(this).attr('id');
    addConsumeItem(id, 'add', 1);
  });

  $('.pantryitem').on('click', '.consume', function() {
    var id = $(this).attr('id');
    addConsumeItem(id, 'consume', 1);
  });

  $('.pantryitem').on('click', '.show-pantry', function () {
    $('.pantryitem').hide();
    displayPantry();
  });



});