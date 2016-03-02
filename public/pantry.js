var cleanDate = function(dateString) {
  var date = new Date(dateString);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  return month + '/' + day + '/' + year;
};

var loadPantry = function () {
  var uid = localStorage.uid;
  var token = localStorage.token;

  $.ajax({
    type:"GET",
    headers: {'Authorization': token},
    url: "http://localhost:9393/api/v1/users/" + uid + "/personal_pantry",
    success: function(data) {
        var length = data['pantry_items'].length;
        var pantryHtml = "";
        pantryHtml += "<table class='table table-responsive table-hover' id='pantry-table'><th>Item</th><th>Portion Size</th>" +
        "<th>Stock</th><th>Consume</th><th>Exp. Date</th>";
        for (i = 0; i < length; i++) {
          var item  = data['pantry_items'][i];
          var expDate = cleanDate(item['expiration_date']);
            pantryHtml +="<tr>" +
            "<td class='item_name td-not-button' id="+item['id']+">" + "<a>"+item["name"]+'</a>' + "</td>" +
            "<td class='portion-size td-not-button' id="+item['id']+">" + item["portion_size"] + "</td>" +
            "<td class='quantity td-not-button' id="+item['id']+">" + item["quantity"] + "</td>" +
            "<td class='consume' id="+item['id']+">" + "<button class='btn btn-default'> -1 </button" + "</td>" +
            "<td class='exp-date td-not-button' id="+item['id']+">" + expDate + "</td>" +
            "</tr>";
          localStorage.setItem('pantryitem' + item['id'] + 'Name', item['name']);
        }
        $('.pantry').html(pantryHtml);

    }
  })
  .fail(function (data) {
    console.log("Error, this failed.");
    $('.flash').text("Uh oh, this failed. Please try again.");
  });
};

var viewItem = function (id) {
  $('#header').text(localStorage.getItem('pantryitem' + id + 'Name'));
  $.ajax({
    type: "GET",
    url: "http://localhost:9393/api/v1/pantryitems/" + id,
    headers: {'Authorization': localStorage.token},
    success: function (data) {
      console.log(data);
      var item = data['pantryitem'];
      var description = "";
      if (item['description'] !== null) {
        description += "<div class='pantryitem-show description'>" + item['description'] + "</div>";
      }
      var pantryitemHtml = description +
        "<div class='pantryitem-show exp-date-show'> Expiration Date: " + cleanDate(item['expiration_date']) + "</div>" +
        "<div class='pantryitem-show quantity-show' id="+id+"> Available Quantity: " + item['quantity'] + "</div>" +
        "<button class='add btn btn-default' id="+id+"> Quick Add </button>" +
        "<button class='show-pantry btn btn-default'> Back to Pantry </button>" +
        "<button class='consume consume-show btn btn-default' id="+id+"> Consume </button>";
      $('.pantryitem').html(pantryitemHtml);
    }
  })
  .fail(function(data) {
    console.log("Uh oh, this failed.");
  });
  $('.pantryitem').show();
  $('.pantry').hide();
  $('.pantryitem').html("<div class='loading-message'>Your item is loading.</div>");
};

var addConsumeItem = function(id, action, quantity) {
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
        $('.flash').text(error['message']);
      }
    }
  })
  .fail(function(data) {
    console.log('This failed.');
    $('.flash').show();
    $('.flash').text("Uh oh, this failed. Please try again.");
  });};

$(document).ready(function () {

  // hide flash div on click if it's been displayed
  $(document).click(function () {
    $('.flash').hide();
  });

  // set header with user's name
  $('#header').text(localStorage.name + "'s Pantry");

  // load user's pantry
  loadPantry();

  // set up on-click for any items that load within the pantry div

  $('.pantry').on('click', '.item_name', function () {
    var id = $(this).attr('id');
    viewItem(id);
  });
  
  $('.pantry').on('click', '.consume', function() {
    var id = $(this).attr('id');
    addConsumeItem(id, 'consume', 1);
  });

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
    $('.pantry').show();
    $('#header').text(localStorage.name + "'s Pantry");
    loadPantry();
  });


});