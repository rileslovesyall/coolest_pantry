//
// HTML SETUP METHODS
//

var setNavbar = function () {
  var navbarHtml = "";

  if (localStorage.token === undefined) {
    navbarHtml += "<a class='login nav-link'>Login</a> / ";
    navbarHtml += "<a class='signup nav-link'>Sign Up</a>";
  }

  if (localStorage.token !== undefined) {
    navbarHtml += "<a class='curr-pantry-link nav-link'>Current Pantry</a> / ";
    navbarHtml += "<a class='add-item nav-link'>Add Item</a> / ";
    navbarHtml += "<a class='expiring-soon nav-link'>Expiring Soon</a> / ";
    navbarHtml += "<a class='out-of-stock-link nav-link'>Out of Stock</a> / ";
    navbarHtml += "<a class='my-account nav-link'>My Account</a> / ";
    navbarHtml += "<a class='logout nav-link'>Logout</a>";
  }

  $('.navbar').html(navbarHtml);
};

//
// HELPER METHODS
//

var baseURL = "http://localhost:9393";
// var baseURL = "https://api.pocketpantry.org";

var cleanDate = function(dateString) {
  console.log(dateString);
  var myDateArray = dateString.split("-");
  var date = new Date(myDateArray[0],myDateArray[1]-1,myDateArray[2]); 
  console.log(date);
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
//  FORM METHODS
//

var clean = function(str) {
  return str.replace('\'', '&#39;');
};
var dirty = function(str) {
  return str.replace('&#39;', '\'');
};

var displayItemForm = function (id) {
  var item = JSON.parse(localStorage.getItem('pantryitem' + id));
  var ingredients = localStorage.getItem('ingredients' + id);
  var name, description, portion, quantity, submitClass, formClass, headerText;
  if (item !== null) {
    name = clean(item['name']);
    if (item['description'] === undefined) {
      description = '';
    } else {
      description = item['description'];
    }
    portion = item['portion'];
    quantity = item['quantity'];
    submitClass = 'edit-item';
    formClass = 'edit-form';
    headerText = 'Edit Item';
  } else {
    name = '';
    description = '';
    portion = '';
    quantity = '';
    ingredients = '';
    submitClass = 'add-item';
    formClass = 'add-form';
    headerText = 'Add Item';
  }
  var formHtml =
    "<form class='"+formClass+"'>" +
      "<fieldset class='form-group'>" +
        "<div class='form-group'>" +
          "<label for='name'> Item Name: </label>" +
          "<input class='form-control' for='name' id='name' type='text' name='name' required value='"+name+"'>" +
        "</div>" +
        "<div class='form-group'>" +
          "<label for='description'>Description: </label>" +
          "<textarea class='form-control for='description' id='description' name='description'>"+description+"</textarea>" +
        "</div>" +
        "<div class='form-group'>" +
          "<label for='portion'>Portion Size: </label>" +
          "<div class='form-note'>(i.e. Gallon, Quart, Pint, Cup etc.)</div>" +
          "<input class='form-control' name = 'portion' for='portion' id='portion' required value='"+portion+"'>" +
        "</div>";
        if (formClass === 'add-form') {
          formHtml += "<div class='form-group'>" +
            "<label for='quantity'>Quantity: </label> " +
            "<input class='form-control' for='quantity' id='quantity' type='number' name='quantity' required'>" +
           "</div>";
          formHtml += "<div class='form-group'>" +
            "<label for='time-to-exp'>Time Until Expiration:</label>" +
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
      "<button class='"+submitClass+" btn btn-default' id='"+id+"'>Submit</button>" +
    "</form>";
  $('.form-holder').show();
  $('.form-holder').html(formHtml);
  $('#header').text(headerText);
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

var submitItem = function (type, id) {
  var token = localStorage.getItem('token');
  event.preventDefault();
  if (type === 'add') {
    postForm('/api/v1/pantryitems', '.add-form');
  } else if (type === 'edit') {
    postForm('/api/v1/pantryitems/'+ id, '.edit-form');
  }
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
      localStorage.name = data['name'];
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
      localStorage.user = JSON.serialize(data);
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
          "<label for='name'>Would you like to receive notifications when your items are expiring soon? </label>" +
          "<select class='form-control' name='exp_notif' id='exp_notif' required>" +
            "<option value='true'>Yes</option>" +
            "<option value='false'>No</option>" +
          "</select>" +
        "</div>" +
        "<div class='form-group'>" +
          "<label for='exp_soon_days'>What Does 'Expiring Soon' Mean to You?</label>" +
          "<input class='form-control'for='exp_soon_quant' id='exp_soon_quant' type='number' name='exp_soon_quant' value='2'required>" +
          "<select class='form-control' name='exp_soon_units' id='exp_soon_units' required>" +
            "<option value='days'>Day(s)</option>" +
            "<option value='weeks' selected='selected'>Week(s)</option>" +
          "</select>" +
        "</div>" +
        "<div class='form-group'>" +
      "</fieldset>" +
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
    console.log(data);
    if (data['errors'] !== undefined) {
      flashMessage("We're sorry. Something went wrong with your update.");
    } else if (data['message'] === "Sorry, this request can not be authenticated. Try again.") {
      flashMessage("We're sorry. Something went wrong with your update.");
    } else {
      flashMessage("Your account has been updated.");
    }
  })
  .fail(function (data) {
    console.log(data);
    flashMessage("Something went wrong. Please try again soon.");
  });
  $('.form-holder').hide();
  accountDisplayRouter();
};

// 
// PANTRY / TABLE DISPLAY METHODS
// 

var displayPantry = function () {
  $('.pantry').show();
  $('.pantry').html("<div class='loading-message'>Hold tight. Your pantry is loading.</div>");
  $('#header').text(localStorage.getItem('name') + "'s Pantry");
  if (localStorage.getItem('currentPantry')) {
    loadPantryLocalStorage();
  }
  loadPantryAPI();
};

var displayItemTable = function (items, divClass, showExp) {
  var tableHTML = "";
  if (items.length === 0) {
    tableHTML = "<h3>Oh no! You don't have any in-stock items in your pantry.</h3>";
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
          console.log("exp_date " +  item['exp_date']);
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
  var uid = localStorage.uid;
  $('#header').text('Expiring Soon');
  $.ajax({
    type: "GET",
    url: baseURL + "/api/v1/users/" + uid + "/expiring_soon",
    headers: {'Authorization': localStorage.token},
    success: function (data) {
      console.log(data);
      if (data.length === 0) {
        expHtml = "You've got nothing expiring soon. Hooray!";
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
  var uid = localStorage.uid;
  $('#header').text('Out of Stock Items');
  $.ajax({
    type: "GET",
    url: baseURL + "/api/v1/users/" + uid + "/out-of-stock",
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
      console.log(data);
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
      "<div class='account-email'><strong>Email:</strong> " +user['email']+ "</div>" +
      "<div class='account-exp-notif'>Expiration Notifications: "+exp+"</div>" +
      "<div class='account-exp-days'>Expiring Soon Setting: " +exp_soon+ "</div>" +
    "</div>" +
    "<button class='btn btn-default edit-account'>Edit Info</button>";

  $('#header').text(localStorage.name + "'s Account");
  $('.account').html(accountHTML);
};

// 
//  SHOW SINGLE ITEM PAGE METHODS
// 

var displaySingleItem = function (id, item, ingredients) {
  var ingHtml = "<div class='ingredients-show'>";
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
    "<button class='edit-btn btn btn-default sm-button' id="+id+"> Edit Item </button>" +
    "<div class='row'>" +
      "<div class='col-xs-6'><button class='consume btn btn-default big-button' id="+id+">Consume</button></div>" +
      "<div class='col-xs-6'><button class='bulk-add-btn btn btn-default big-button' id="+id+">Bulk Add</button></div>" +
    "</div>";
  $('.pantryitem').show();
  $('.pantryitem').html(pantryitemHtml);
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
        if (action == 'add') {
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
    "<input class='form-control' for='quantity' id='quantity' type='number' name='quantity' required'>" +
    "<button class='btn btn-default bulk-quant-submit' id='"+id+"'>"+action+"</button>" +
   "</div>";
   $('.add-consume').show();
  $('.add-consume').html(addHtml);
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


  // NAVBAR DIV

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

  $('.navbar').on('click', '.curr-pantry-link', function () {
    $('.main').hide();
    displayPantry();
  });
  
  $('.navbar').on('click', '.out-of-stock-link', function () {
    $('.main').hide();
    displayOutOfStock();
  });

  $('.navbar').on('click', '.add-item', function () {
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

  $('.form-holder').on('click', '.add-item', function () {
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

  // PANTRY DIV

  $('.pantry').on('click', '.item_name', function () {
    var id = $(this).attr('id');
    $('.main').hide();
    viewItem(id);
  });

  // EXPIRING DIV

  $('.expiring').on('click', '.item_name', function () {
    var id = $(this).attr('id');
    $('.main').hide();
    viewItem(id);
  });

  // OUT OF STOCK DIV

  $('.out-of-stock').on('click', '.item_name', function () {
    var id = $(this).attr('id');
    $('.main').hide();
    viewItem(id);
  });

  // PANTRYITEM SHOW DIV

  $('.pantryitem').on('click', '.add', function() {
    var id = $(this).attr('id');
    addConsumeItem(id, 'add', 1);
  });

  $('.pantryitem').on('click', '.edit-btn', function () {
    var id = $(this).attr('id');
    $('.pantryitem').hide();
    displayItemForm(id);
  });

  $('.pantryitem').on('click', '.bulk-add-btn', function () {
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
    var quant = $('#quantity').val();
    var action = $('.bulk-quant-submit').text().toLowerCase();
    addConsumeItem(id, action, quant);
    $('.bulk-quant-form').hide();
  });


});