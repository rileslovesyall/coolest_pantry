$(document).ready(function () {
  var uid = localStorage.uid;
  var token = localStorage.token;

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