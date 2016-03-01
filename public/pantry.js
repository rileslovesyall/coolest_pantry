$(document).ready(function () {
  var uid = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  var token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  $.ajax({
    type:"GET",
    headers: {'Authorization': token},
    url: "http://localhost:9393/api/v1/users/" + uid + "/personal_pantry",
    success: function(data) {
        console.log(data);
    }
  })
  .done(function (data) {
    var length = data['pantry_items'].length;
    var pantryHtml = "";
    for (i = 0; i < length; i++) {
      var item  = data['pantry_items'][i];
        pantryHtml += "<div class='pantryitem' id=" + item['id'] + "> Name: " +
          item['name'] + "<br> Description: " + item['description'] + "</div>";
    }
    $('#pantry').html(pantryHtml);
  });

});