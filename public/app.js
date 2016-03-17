//
// HTML SETUP METHODS
//

var setNavbar = function () {
  var navbarHtml = "<ul class='nav navbar-nav'>";
  navbarHtml += "<li><a class='about-link nav-link'>About</a></li> ";

  if (localStorage.token === undefined) {
    navbarHtml += "<li><a class='login nav-link'>Login</a></li>";
    navbarHtml += "<li><a class='signup nav-link'>Sign Up</a></li>";
  }

  if (localStorage.token !== undefined) {
    navbarHtml += "<li><a class='my-account nav-link'>My Account</a></li>";
    navbarHtml += "<li><a class='logout nav-link'>Logout</a></li>";
    navbarHtml += "<li class='dropdown'>" +
      "<a href='#'' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>My Pantry <span class='caret'></span></a>" +
      "<ul class='dropdown-menu'>";
    navbarHtml += "<li><a class='new-item nav-link'>Add Item</a></li>";
    navbarHtml += "<li><a class='curr-pantry-link nav-link'>Current Pantry</a></li>";
    navbarHtml += "<li><a class='expiring-soon nav-link'>Expiring Soon</a> </li>";
    navbarHtml += "<li><a class='out-of-stock-link nav-link'>Out of Stock</a> </li>";
    navbarHtml += "</ul>";
  }

  navbarHtml += "</ul>";
  $('.navbar').html(navbarHtml);
};

//
// HELPER METHODS
//

// var baseURL = "http://localhost:9393";
var baseURL = "https://api.pocketpantry.org";

var cleanDate = function(dateString) {
  var myDateArray = dateString.split("-");
  var date = new Date(myDateArray);
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

var flashMessage = function (message) {
  $('.flash').show();
  $('.flash').text(message);
};

// 
// SPLASH PAGE
// 

var displaySplash = function () {
  $('.navbar').hide();
  $('.main').hide();
  $('.splash').show();
};

// 
// STATIC ABOUT PAGE
// 

var displayAbout = function () {

// aboutHTML +=
//  "<div class='divider'></div>" +
//  "<h1 class='header'>About the Creator</h1>" +

//  "<h2>Pocket Pantry was created by <a href='http://rileyspicer.com'>Riley Spicer</a> as a capstone project for <a href='http://adadevelopersacademy.org'>Ada Developer's Academy</a>.</h2>";

  $('#header').text("About Pocket Pantry");
  $('.about').show();
};

//
//  FORM METHODS
//

var clean = function(str) {
  return str.replace('\'', '&#39;');
};
var dirty = function(str) {
  return str.replace('&#39;', '\'');
};

var displayItemForm = function (id, newName) {
  var item = JSON.parse(localStorage.getItem('pantryitem' + id));
  var ingredients = localStorage.getItem('ingredients' + id);
  var name, description, portion, quantity, submitClass, formClass, headerText;
  if (item !== null) {
    if (newName) {
      name = clean(newName);
      submitClass = 'new-item';
      formClass = 'add-form';
      headerText = 'Copy Item';
    } else {
      name = clean(item['name']);
      submitClass = 'edit-item';
      formClass = 'edit-form';
      headerText = 'Edit Item';
    }
    if (item['description'] === undefined) {
      description = '';
    } else {
      description = item['description'];
    }
    portion = item['portion'];
    quantity = item['quantity'];
  } else {
    name = '';
    description = '';
    portion = '';
    quantity = '';
    ingredients = '';
    submitClass = 'new-item';
    formClass = 'add-form';
    headerText = 'Add Item';
  }
  var formHtml =
    "<form class='"+formClass+"'>" +
      "<fieldset class='form-group'>" +
        "<div class='form-group'>" +
          "<label for='name'>*Item Name: </label>" +
          "<input class='form-control' for='name' id='name' type='text' name='name' required value='"+name+"'>" +
        "</div>" +
        "<div class='form-group'>" +
          "<label for='description'>Description: </label>" +
          "<textarea class='form-control for='description' id='description' name='description'>"+description+"</textarea>" +
        "</div>" +
        "<div class='form-group'>" +
          "<label for='portion'>*Portion Size: </label>" +
          "<div class='form-note'>(i.e. Gallon, Quart, Pint, Cup etc.)</div>" +
          "<input class='form-control' name = 'portion' for='portion' id='portion' required value='"+portion+"'>" +
        "</div>";
        if (formClass === 'add-form') {
          formHtml += "<div class='form-group'>" +
            "<label for='quantity'>*Quantity: </label> " +
            "<input class='form-control' for='quantity' id='quantity' type='number' name='quantity' required'>" +
           "</div>";
          formHtml += "<div class='form-group'>" +
            "<label for='time-to-exp'>*Time Until Expiration:</label>" +
            "<input class='form-control'for='time-to-exp' id='time-to-exp' type='number' name='time-to-exp' required>" +
            "<select class='form-control' name='exp-unit' id='exp-unit' required>" +
              "<option value='days'>Day(s)</option>" +
              "<option value='months'>Month(s)</option>" +
              "<option value='years'>Year(s)</option>" +
            "</select>" +
          "</div>";
        }
        formHtml +=
        "<div class='form-group'>" +
          "<label for='ingredients'>Ingredients: </label>" +
          "<div class='form-note'>(please separate with a comma)</div>" +
          "<textarea class='form-control' for='ingredients' id='ingredients'  name='ingredients'>"+ingredients+"</textarea>" +
         "</div>" +
      "</fieldset>" +
      "<div class='form-small'>* - required field</div>" +
      "<button class='"+submitClass+" btn btn-default' id='"+id+"'>Submit</button>" +
    "</form>";
  $('.form-holder').show();
  $('.form-holder').html(formHtml);
  $('#header').text(headerText);
};

var submitItem = function (type, id) {
  var token = localStorage.getItem('token');
  event.preventDefault();
  if (type === 'add') {
    postForm('/api/v1/pantryitems', '.add-form');
  } else if (type === 'edit') {
    postForm('/api/v1/pantryitems/'+ id, '.edit-form');
  }
};

var postForm = function(path, form) {
  var token = localStorage.token;
  $.ajax({
    type: 'POST',
    url: baseURL + path,
    headers: {'Authorization': token},
    data: $(form).serialize(),
    success: function(data) {
      $('.form-holder').hide();
      displayPantry();
      }
    })
  .fail (function(data) {
    console.log(data);
    flashMessage('Uh oh, this failed. Please try again.');
  });
};

var displayLoginForm = function () {
  var formHtml =
  "<form class='login-form'>" +
    "<fieldset class='form-group'>" +
      "<div class='form-group'>" +
        "<label for='email'>Email: </label>" +
        "<input class='form-control' for='email' id='email' name='email' type='email'>" +
      "</div>" +
      "<div class='form-group'>" +
        "<label for='password'>Password: </label>" +
        "<input class='form-control' for='password' id='password' name='password' type='password'>" +
      "</div>" +
    "</fieldset>" +
    "<button class='btn btn-default login-button'>Submit</button>" +
  "</form>";
  $('.form-holder').show();
  $('.form-holder').html(formHtml);
  $('#header').text('Login');
};

var submitLogin = function () {
  event.preventDefault();
  $.post(baseURL + '/api/v1/token',
    $('.login-form').serialize())
  .done(function (data) {
    console.log(data);
    if (data['error'] === undefined) {
      localStorage.token = data['token'];
      localStorage.uid = data['uid'];
      localStorage.user = JSON.stringify(data);
      setNavbar();
      $('.form-holder').hide();
      displayPantry();
    } else {
      console.log(data['error']);
      flashMessage(data['error']);
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
      "<div class='form-group'>" +
        "<label for='name'>Name: </label>" +
        "<input class='form-control' for='name' id='name' name='name' type='text'>" +
      "</div>" +
      "<div class='form-group'>" +
        "<label for='email'>Email: </label>" +
        "<input class='form-control' for='email' id='email' name='email' type='email'>" +
      "</div>" +
      "<div class='form-group'>" +
        "<label for='password'>Password: </label>" +
        "<input class='form-control' for='password' id='password' name='password' type='password'>" +
      "</div>" +
      "<div class='form-group'>" +
        "<label for='password_confirmation'>Password Confirmation: </label>" +
        "<input class='form-control' for='password_confirmation' id='password_confirmation' name='password' type='password'>" +
      "</div>" +
    "</fieldset>" +
    "<button class='btn btn-default signup-button'>Sign Up</button>" +
  "</form>";
  $('.form-holder').show();
  $('.form-holder').html(formHtml);
  $('#header').text('Sign Up');
};

var submitSignup = function () {
  event.preventDefault();
  $.post(baseURL + '/api/v1/users',
    $('.signup-form').serialize())
  .done(function (data) {
    console.log(data);
    if (data['error'] === undefined) {
      localStorage.token = data['user']['api_token'];
      localStorage.uid = data['user']['id'];
      localStorage.name = data['user']['name'];
      localStorage.user = JSON.stringify(data['user']);
      $('.form-holder').hide();
      setNavbar();
      displayPantry();
    } else {
      console.log(data['error']);
    }
  })
  .fail(function (data){
    console.log('This request failed.');
    flashMessage("Something went wrong. Please try again later.");
  });
};

var displayEditAccount = function () {
  var user = JSON.parse(localStorage.user);
  var formHTML = "";
  formHTML +=
    "<form class='edit-account-form'>" +
      "<fieldset class='form-group'>" +
        "<div class='form-group'>" +
          "<label for='name'>Name: </label>" +
          "<input class='form-control' for='name' id='name' name='name' type='text' value="+user['name']+">" +
        "</div>" +
        "<div class='form-group'>" +
          "<label for='email'>Email: </label>" +
          "<input class='form-control' for='email' id='email' name='email' type='email' value="+user['email']+">" +
        "</div>" +
        "<div class='form-group'>" +
          "<label for='exp_notif'>Would you like to receive notifications when your items are expiring soon? </label>" +
          "<select class='form-control' name='exp_notif' id='exp_notif' required>" +
            "<option value='true'>Yes</option>" +
            "<option value='false'>No</option>" +
          "</select>" +
        "</div>" +
        "<div class='form-group'>" +
          "<label for='exp_soon_days'>What Does 'Expiring Soon' Mean to You?</label><br>" +
          "<input class='form-control'for='exp_soon_quant' id='exp_soon_quant' type='number' name='exp_soon_quant' value='2'required>" +
          "<select class='form-control' name='exp_soon_units' id='exp_soon_units' required>" +
            "<option value='days'>Day(s)</option>" +
            "<option value='weeks' selected='selected'>Week(s)</option>" +
          "</select>" +
        "</div>" +
      "</fieldset>" +
      "<div class='form-group'>" +
        "<label for='password'>Password: <div class='form-note'>required</div></label>" +
        "<input class='form-control' for='password' id='password' type='password' name='password' required>" +
      "</div>" +
      "<button class='btn btn-default edit-account-button'>Submit</button>" +
    "</form>";

  $('.form-holder').show();
  $('.form-holder').html(formHTML);
};

var submitEditAccount = function () {
  event.preventDefault();
  $.ajax({
    type: 'POST',
    url: baseURL + '/api/v1/users/' + localStorage.uid,
    headers: {'Authorization': localStorage.token},
    data: $('.edit-account-form').serialize()
  })
  .done(function (data) {
    if (data['errors'] !== undefined) {
      flashMessage("We're sorry. Something went wrong with your update.");
    } else if (data['message'] === "Sorry, this request can not be authenticated. Try again.") {
      flashMessage("We're sorry. Something went wrong with your update.");
    } else {
      flashMessage("Your account has been updated.");
      localStorage.user = JSON.stringify(data['user']);
    }
  })
  .fail(function (data) {
    var response = JSON.parse(data.responseText);
    if (response !== undefined) {
      flashMessage(response['error']);
    } else {
      flashMessage("Something went wrong. Please try again soon.");
    }
  });
  $('.form-holder').hide();
  accountDisplayRouter();
};

// 
// PANTRY / TABLE DISPLAY METHODS
// 

var displayPantry = function () {
  var user = JSON.parse(localStorage.user);
  $('.main').hide();
  $('.pantry').show();
  $('.pantry').html("<div class='loading-message'>Hold tight. Your pantry is loading.</div>");
  $('#header').text(user['name'] + "'s Pantry");
  if (localStorage.getItem('currentPantry')) {
    loadPantryLocalStorage();
  }
  loadPantryAPI();
};

var displayItemTable = function (items, divClass, showExp) {
  var tableHTML = "";
  if (items.length === 0) {
    tableHTML = "<h3>You don't have any items in your pantry.</h3><p class='pantry-p'>Click 'Add Item' under the 'My Pantry' tab to add a new item to your pantry, or browse your out of stock items in the 'Out-of-Stock' tab.</p>";
  } else {
    tableHTML += "<table class='table table-responsive' id='pantry-table'><th>item</th><th>portion size</th>" +
    "<th>quantity</th>";
    if (showExp) {
      tableHTML += "<th>expiration date</th>";
    }
    for (i=0; i<items.length;i++) {
      var item = items[i];
      if (showExp) {
        var expDate;
        if (item['exp_date'] === null) {
          expDate = 'N/A';
        } else {
          expDate = cleanDate(item['exp_date']);
        }
      }
      tableHTML +=
        "<tr>" +
          "<td class='item_name td-not-button' id="+item['id']+">" + "<a>"+item["name"]+'</a>' + "</td>" +
          "<td class='portion-size td-not-button' id="+item['id']+">" + item["portion"] + "</td>" +
          "<td class='quantity td-not-button' id="+item['id']+">" + item["quantity"] + "</td>";
        if (showExp) {
          tableHTML += "<td class='exp td-not-button' id="+item['id']+">" + expDate + "</td>";
        }
      tableHTML += "</tr>";
    }
    tableHTML += "</table>";
  }
  $(divClass).html(tableHTML);
};

var loadPantryLocalStorage = function () {
  displayItemTable(JSON.parse(localStorage.getItem('currentPantry')), '.pantry');
};

var loadPantryAPI = function () {
  var uid = localStorage.uid;

  $.ajax({
    type:"GET",
    headers: {'Authorization': localStorage.token},
    url: baseURL + "/api/v1/users/" + uid + "/personal_pantry",
    success: function(data) {
      var length = data['pantry_items'].length;
      var itemsArr = [];
      for (i = 0; i < length; i++) {
        var item  = data['pantry_items'][i];
        itemsArr.push(item);
      }
      displayItemTable(data['pantry_items'], '.pantry');

      // reset localStorage to most up-to-date data
      localStorage.setItem('currentPantry', JSON.stringify(itemsArr));
      storeEachToLocalStorage(itemsArr);
    }
  })
  .fail(function (data) {
    console.log("Error, loading from the API failed.");
  });
  
};

var displayExpiringSoon = function () {
  $('.expiring').show();
  $('.expiring').text("Loading your items.");
  $('#header').text('Expiring Soon');
  $.ajax({
    type: "GET",
    url: baseURL + "/api/v1/users/" + localStorage.uid + "/expiring_soon",
    headers: {'Authorization': localStorage.token},
    success: function (data) {
      console.log(data);
      if (data.length === 0) {
        $('.expiring').html("You've got nothing expiring soon. Hooray!");
      } else {
        displayItemTable(data, '.expiring', true);
      }
    }
  })
  .fail(function () {
    flashMessage('Something went wrong. Please try again.');
  });
};

var displayOutOfStock = function () {
  $('.out-of-stock').show();
  $('out-of-stock').text("Loading your items.");
  $('#header').text('Out of Stock Items');
  $.ajax({
    type: "GET",
    url: baseURL + "/api/v1/users/" + localStorage.uid + "/out-of-stock",
    headers: {'Authorization': localStorage.token},
    success: function (data) {
      var length = data['pantry_items'].length;
      var itemsArr = [];
      for (i = 0; i < length; i++) {
        var item  = data['pantry_items'][i];
        itemsArr.push(item);
      }
      if (length === 0) {
        $('.out-of-stock').html("You've got nothing out of stock.");
      } else {
        displayItemTable(data['pantry_items'], '.out-of-stock');
      }

      // reset localStorage to most up-to-date data
      localStorage.setItem('outOfStock', JSON.stringify(itemsArr));
      storeEachToLocalStorage(itemsArr);
    }
  })
  .fail(function () {
    flashMessage('Something went wrong. Please try again.');
  });
  if (localStorage.getItem('outOfStock')) {
    displayItemTable(JSON.parse(localStorage.getItem('outOfStock')), '.out-of-stock');
  }
};

//
// ACCOUNT DISPLAY METHODS
//

var accountDisplayRouter = function () {
  $('.account').show();
  if (localStorage.user !== undefined) {
    displayMyAccount(JSON.parse(localStorage.user));
  }
  $.ajax({
    type: 'GET',
    url: baseURL + '/api/v1/users/' + localStorage.uid,
    headers: {'Authorization': localStorage.token},
    success: function (data) {
      displayMyAccount(data);
      localStorage.user = JSON.stringify(data);
    }
  })
  .fail(function () {
    console.log('This failed.');
  });
};

var displayMyAccount = function (user) {
  var accountHTML = "";
  var exp = "";
  if (user.exp_notif === true) {
    exp = "On";
  } else {
    exp = "Off";
  }
  var exp_soon = "";
  if (user.exp_soon_days < 7) {
    exp_soon = user.exp_soon + " days";
  } else {
    exp_soon = (user.exp_soon_days / 7) + " weeks";
  }
  accountHTML +=
    "<div class='account-info'>" +
      "<div class='account-name'>Name: " +user['name']+ "</div>" +
      "<div class='account-email'>Email: " +user['email']+ "</div>" +
      "<div class='account-exp-notif'>Expiration Notifications: "+exp+"</div>" +
      "<div class='account-exp-days'>Expiring Soon Setting: " +exp_soon+ "</div>" +
    "</div>" +
    "<div class='row'><div class='col-xs-12'>" +
      "<button class='btn btn-default acct-btn edit-account'>Edit Info</button>" +
      "<button class='btn btn-default acct-btn delete-account'>Delete Account</button>" +
    "</div></div>";

  $('#header').text(user['name'] + "'s Account");
  $('.account').html(accountHTML);
};

var deleteAccount = function () {
  $.ajax({
    type: 'DELETE',
    url: baseURL + '/api/v1/users/' + localStorage.uid,
    headers: {'Authorization': localStorage.token},
    success: function(data) {
      console.log(data);
      flashMessage("Your account has been deleted.");
      localStorage.clear();
      $('.main').hide();
      setNavbar();
      displaySignupForm();
    }
  })
  .fail(function(data) {
    console.log(data);
    flashMessage("Uh oh, something went wrong. Please try again.");
  });
};

// 
//  SHOW SINGLE ITEM PAGE METHODS
// 

var displaySingleItem = function (id, item, ingredients) {
  var ingHtml = "<div class='ingredients-show'> Ingredients: ";
  if (Array.isArray(ingredients)) {
    if (ingredients.length > 0) {
      for (var i = 0; i < ingredients.length -1; i++) {
        ingHtml += ingredients[i]['name'] + ", ";
      }
      ingHtml += ingredients[ingredients.length-1]['name'];
    }
  } else if (ingredients !== null){
    ingHtml += ingredients;
  }
  ingHtml += " </div>";

  var description = "";
  if (item['description'] !== null) {
    description += "<div class='pantryitem-show description-show'>" + item['description'] + "</div>";
  }
  var pantryitemHtml = description +
    "<div class='pantryitem-show quantity-show' id="+id+"> Available Quantity: " + item['quantity'] + "</div>" +
    ingHtml +
    "<div class='row'>";
      if (item['quantity'] > 0) {
        pantryitemHtml += "<div class='col-xs-12'>" +
          "<button class='consume btn btn-default big-button' id="+id+"> Consume </button>" +
          "<button class='bulk-add-btn btn btn-default big-button' id="+id+"> Add </button>" +
        "</div>";
      } else {
        pantryitemHtml += "<div class='col-xs-12'><button class='bulk-add-btn-alone btn btn-default big-button' id="+id+">Bulk Add</button></div>";
      }
    var buttonsHtml = "</div>" +
    "<div class='row'><div class='col-xs-12'>" +
      "<button class='edit-btn btn btn-default sm-button' id="+id+"> Edit </button>" +
      "<button class='copy-btn btn btn-default sm-button' id="+id+"> Copy </button>" +
      "<button class='delete-btn btn btn-default sm-button' id="+id+"> Delete </button>" +
    "</div></div>" +
    "<div class='row'><div class='col-xs-12'>" +
      "<button class='curr-pantry-link btn btn-default sm-button' id="+id+"> Back to Pantry </button>" +
    "</div></div>";
  $('.pantryitem').show();
  $('.pantryitem').html(pantryitemHtml);
  $('.item-buttons').show();2
  $('.item-buttons').html(buttonsHtml);
};

var viewItem = function (id) {
  // ajax call to get latest data
  $.ajax({
    type: "GET",
    url: baseURL + "/api/v1/pantryitems/" + id,
    headers: {'Authorization': localStorage.token},
    success: function (data) {
      var item = data['pantryitem'];
      var ings = data['ingredients'];
      displaySingleItem(id, item, ings);

      // save most recent ingredients list to localStorage
      if (ings.length > 0) {
          var ingString = ings[0]['name'];
          for (var i = 1; i < ings.length; i++) {
            ingString += ", " + ings[i]['name'];
          }
          localStorage.setItem('ingredients'+item['id'], ingString);
        }
      }
  })
  .fail(function(data) {
    console.log("Uh oh, this failed.");
  });
  // hide pantry div, display pantryitem div, set loading message / new header
  // $('.pantry').hide();
  $('.pantryitem').show();
  $('.pantryitem').html("<div class='loading-message'>Your item is loading.</div>");

  // get current item from local Storage and set header
  var currItem = JSON.parse(localStorage.getItem('pantryitem' + id));
  var ingredients = localStorage.getItem('ingredients' + id);
  $('#header').text(currItem['name']);

  // pull info from localStorage
  displaySingleItem(id, currItem, ingredients);
};



var addConsumeItem = function(id, action, quantity) {
  // make AJAX call to check data against API
  $.ajax({
    type: "POST",
    url: baseURL + "/api/v1/pantryitems/" + id + "/" + action ,
    headers: {'Authorization': localStorage.token},
    data: 'quantity=' + quantity,
    success: function (data) {
      if (data['error'] === undefined) {
        $('#'+id+'.quantity').text(data['pantryitem']['quantity']);
        $('#'+id+'.quantity-show').text("Available Quantity: "+ data['pantryitem']['quantity']);
        // update localStorage
        var currItem = JSON.parse(localStorage.getItem('pantryitem' + id));
        if (action === 'add') {
          currItem['quantity'] += 1;
        } else if (action === 'consume') {
          currItem['quantity'] -= 1;
        }
        localStorage.setItem('pantryitem' + id, JSON.stringify(currItem));
        if (action === 'add') {
          flashMessage("You have " + action + "ed " + quantity + " " + currItem['name'] + "(s) to your inventory.");
        } else {
          flashMessage("You have " + action + "d " + quantity + " " + currItem['name'] + "(s) from your inventory.");
        }
      } else {
        flashMessage(data['error']);
      }
    }
  })
  .fail(function(data) {
    console.log('This failed.');
    $('.flash').show();
    $('.flash').text("Uh oh, this failed. Please try again.");
  });
};

var displayBulkQuant = function (id, action) {
  event.preventDefault();
  var addHtml = "";
  addHtml += "<div class='form-group bulk-quant-form'>" +
      "<label for='quantity'>Quantity: </label> " +
      "<input class='form-control' for='add-quantity' id='add-quantity' type='number' name='add-quantity' required'>" +
      "<button class='btn btn-default bulk-quant-submit' id='"+id+"'>"+action+"</button>" +
    "</div>";
  $('.add-consume').show();
  $('.add-consume').html(addHtml);
};

var deleteItem = function (id) {
  event.preventDefault();
  $.ajax({
    type: 'DELETE',
    url: baseURL + '/api/v1/pantryitems/' + id,
    headers: {'Authorization': localStorage.token},
    success: function (data) {
      console.log(data);
      var currItem = JSON.parse(localStorage.getItem('pantryitem' + id));
      localStorage.removeItem('pantryitem' + id);
      flashMessage(currItem['name'] + " has been deleted.");
      $('.main').hide();
      displayPantry();
    }
  })
  .fail(function (data) {
    console.log(data);
    flashMessage("Uh Oh. Something went wrong. Please try again later.");
    $('.main').hide();
    displayPantry();
  });
};

var copyItem = function (id) {
  event.preventDefault();
  currItem = JSON.parse(localStorage.getItem('pantryitem' + id));
  displayItemForm(id, currItem['name'] + '(copy)');
};

// 
// 
// 
//  DOCUMENT READY CODE BELOW
// 
// 
// 

$(document).ready(function () {

  window.onbeforeunload = function(){
  return 'Leaving this page will end your Pocket Pantry session.';
};
  // hide flash div on click if it's been displayed
  $(document).click(function () {
    $('.flash').hide();
  });

  // setup HTML
  $('.flash').hide();
  $('.splash').hide();

  setNavbar();

  if (localStorage.token) {
    displayPantry();
  } else {
    $('.background').hide();
    displaySplash();
  }

  // SPLASH DIV
  $('.splash').on('click', '#splash-login', function () {
    $('.background').show();
    $('.main').hide();
    $('.navbar').show();
    displayLoginForm();
  });

  $('.splash').on('click', '#splash-signup', function () {
    $('.background').show();
    $('.main').hide();
    $('.navbar').show();
    displaySignupForm();
  });

  $('.splash').on('click', '#splash-about', function () {
    $('.background').show();
    $('.main').hide();
    $('.navbar').show();
    displayAbout();
  });


  // NAVBAR DIV

  $('.navbar').on('click', '.about-link', function () {
    $('.main').hide();
    displayAbout();
  });

  $('.navbar').on('click', '.login', function () {
    $('.main').hide();
    displayLoginForm();
  });

  $('.navbar').on('click', '.signup', function () {
    $('.main').hide();
    displaySignupForm();
  });

  $('.navbar').on('click', '.logout', function () {
    localStorage.clear();
    $('.background').hide();
    $('.main').hide();
    setNavbar();
    displaySplash();
  });

  $('.navbar').add('.item-buttons').on('click', '.curr-pantry-link', function () {
    $('.main').hide();
    displayPantry();
  });
  
  $('.navbar').on('click', '.out-of-stock-link', function () {
    $('.main').hide();
    displayOutOfStock();
  });

  $('.navbar').on('click', '.new-item', function () {
    $('.main').hide();
    displayItemForm();
  });

  $('.navbar').on('click', '.expiring-soon', function () {
    $('.main').hide();
    displayExpiringSoon();
  });

  $('.navbar').on('click', '.my-account', function () {
    $('.main').hide();
    accountDisplayRouter();
  });

  // FORM DIV

  $('.form-holder').on('click', '.login-button', function () {
    submitLogin();
  });

  $('.form-holder').on('click', '.signup-button', function () {
    submitSignup();
  });

  $('.form-holder').on('click', '.new-item', function () {
    submitItem('add');
  });

  $('.form-holder').on('click', '.edit-item', function () {
    var id = $(this).attr('id');
    submitItem('edit', id);
  });

  $('.form-holder').on('click', '.edit-account-button', function () {
    var id = $(this).attr('id');
    submitEditAccount();
  });

  // ACCOUNT DIV

 $('.account').on('click', '.edit-account', function () {
   var id = $(this).attr('id');
   $('.main').hide();
   displayEditAccount();
 });

 $('.account').on('click', '.delete-account', function () {
   if (confirm("Are you sure you want to delete your account?")) {
    $('.main').hide();
    deleteAccount();
   }
 });

// CLICKS TO VIEW ITEM

  $('.expiring').add('.pantry').add('.out-of-stock').on('click', '.item_name', function () {
    var id = $(this).attr('id');
    $('.main').hide();
    viewItem(id);
  });

  // ITEM BUTTONS


  $('.item-buttons').on('click', '.edit-btn', function () {
    var id = $(this).attr('id');
    $('.main').hide();
    displayItemForm(id);
  });

  $('.item-buttons').on('click', '.delete-btn', function () {
    if (confirm("Are you sure you want to delete this item?")) {
      var id = $(this).attr('id');
      $('.main').hide();
      deleteItem(id);
    }
  });

  $('.item-buttons').on('click', '.copy-btn', function () {
    var id = $(this).attr('id');
    $('.main').hide();
    copyItem(id);
  });

  // PANTRYITEM SHOW DIV

  $('.pantryitem').on('click', '.add', function() {
    var id = $(this).attr('id');
    addConsumeItem(id, 'add', 1);
  });

  $('.pantryitem').on('click', '.bulk-add-btn, .bulk-add-btn-alone', function () {
    var id = $(this).attr('id');
    displayBulkQuant(id, 'Add');
  });

  $('.pantryitem').on('click', '.consume', function() {
    var id = $(this).attr('id');
    displayBulkQuant(id, 'Consume');
  });

  // ADD CONSUME FORM CLICK

  $('.add-consume').on('click', '.bulk-quant-submit', function() {
    event.preventDefault();
    var id = $(this).attr('id');
    var quant = $('#add-quantity').val();
    console.log(quant);
    var action = $('.bulk-quant-submit').text().toLowerCase();
    addConsumeItem(id, action, quant);
    $('.bulk-quant-form').hide();
  });


});