$(document).ready(function () {
  var uid = localStorage.uid;
  var token = localStorage.token;

  $.ajax({
    type:"GET",
    headers: {'Authorization': token},
    url: "http://localhost:9393/api/v1/users/" + uid + "/personal_pantry",
    success: function(data) {
        var length = data['pantry_items'].length;
        var pantryHtml = "";
        pantryHtml += "<table id='pantry-table'><th>Item</th><th>Portion Size</th>" +
        "<th>Stock</th><th>Add More</th><th>Consume</th>";
        for (i = 0; i < length; i++) {
          var item  = data['pantry_items'][i];
            pantryHtml +="<tr>" +
            "<td class='item_name' id="+item['id']+">" + item["name"] + "</td>" +
            "<td class='portion_size' id="+item['id']+">" + "FILL ME" + "</td>" +
            "<td class='stock' id="+item['id']+">" + item["quantity"] + "</td>" +
            "<td class='add' id="+item['id']+">" + "ADD" + "</td>" +
            "<td class='consume' id="+item['id']+">" + "CONSUME" + "</td>" +
            "</tr>";
        }
        $('#pantry').html(pantryHtml);
    }
  })
  .done(function (data) {
    console.log('done');
  })
  .fail(function (data) {
    console.log(data);
    console.log("Error, this failed.");
  });

});