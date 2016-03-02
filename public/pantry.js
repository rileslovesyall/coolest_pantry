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
            "<td class='stock td-not-button' id="+item['id']+">" + item["quantity"] + "</td>" +
            "<td class='consume' id="+item['id']+">" + "<button class='btn btn-default'> Consume </button" + "</td>" +
            "<td class='exp-date td-not-button' id="+item['id']+">" + expDate + "</td>" +
            "</tr>";
          localStorage.setItem('pantryitem' + item['id'] + 'Name', item['name']);
        }
        $('.pantry').html(pantryHtml);

    }
  })
  .done(function (data) {
    console.log('done');
  })
  .fail(function (data) {
    console.log(data);
    console.log("Error, this failed.");
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
      "<div class='pantryitem-show exp-date'> Expiration Date: " + cleanDate(item['expiration_date']) + "</div>" +
      "<div class='pantryitem-show quantity'> Available Quantity: " + item['quantity'] + "</div>" +
      "<button class='show-pantry btn btn-default'> Back to Pantry </button>";
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
        $('#'+id+'.stock').html(data['pantryitem']['quantity']);
      } else {
        console.log(error);
      }
    }
  })
  .fail(function(data) {
    console.log("Uh oh, this failed.");
  });};

$(document).ready(function () {
  // set header with user's name
  $('#header').text(localStorage.name + "'s Pantry");

  // load user's pantry
  loadPantry();

  // set up on-click for any items that load within the pantry div
  $('.pantry').on('click', '.item_name', function () {
    var id = $(this).attr('id');
    var name = $(this).val();
    console.log(name);
    viewItem(id);
  });

  $('.pantry').on('click', '.add', function() {
    var id = $(this).attr('id');
    addConsumeItem(id, 'add', 1);
  });
  
  $('.pantry').on('click', '.consume', function() {
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