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

  // set up on-click for any items that load within the pantry div
  $('.pantry').on('click', '.item_name', function () {
    var id = $(this).attr('id');
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

  // load user's pantry
  loadPantry();

});