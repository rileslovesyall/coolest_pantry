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
        "<th>Stock</th><th>Add More</th><th>Consume</th>";
        for (i = 0; i < length; i++) {
          var item  = data['pantry_items'][i];
            pantryHtml +="<tr>" +
            "<td>" + "<a class='item_name' id="+item['id']+">"+item["name"]+'</a>' + "</td>" +
            "<td class='portion_size' id="+item['id']+">" + "FILL ME" + "</td>" +
            "<td class='stock' id="+item['id']+">" + item["quantity"] + "</td>" +
            "<td class='add' id="+item['id']+">" + "ADD" + "</td>" +
            "<td class='consume' id="+item['id']+">" + "CONSUME" + "</td>" +
            "</tr>";
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
  $.ajax({
    type: "GET",
    url: "http://localhost:9393/api/v1/pantryitems/" + id,
    headers: {'Authorization': localStorage.token},
    success: function (data) {
      console.log(data);
    }
  })
  .fail(function(data) {
    console.log("Uh oh, this failed.");
  });
};

var addItem = function (id) {
  $.ajax({
    type: "POST",
    url: "http://localhost:9393/api/v1/pantryitems/" + id + "/add" ,
    headers: {'Authorization': localStorage.token},
    data: 'quantity=1',
    success: function (data) {
      console.log(data);
    }
  })
  .fail(function(data) {
    console.log("Uh oh, this failed.");
  });
};

var consumeItem = function(id) {
  console.log("An item is consumed");
};

$(document).ready(function () {
  // set header with user's name
  $('#header').text(localStorage.name + "'s Pantry");

  // set up on-click for any items that load within the pantry div
  $('.pantry').on('click', '.item_name', function () {
    var id = $(this).attr('id');
    viewItem(id);
  });

  $('.pantry').on('click', '.add', function() {
    var id = $(this).attr('id');
    addItem(id);
  });

  $('.pantry').on('click', '.consume', function() {
    var id = $(this).attr('id');
    consumeItem(id);
  });

  // load user's pantry
  loadPantry();

});