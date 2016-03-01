$(document).ready(function () {
  var uid = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  var token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  $.ajax({
    type:"GET",
    // headers: {},
    beforeSend: function (request)
      { request.setRequestHeader('Authorization', token); },
    url: "http://localhost:9393/api/v1/users/" + uid + "/personal_pantry",
    success: function(data) {
        console.log(data);
    }
  })
  .done(function (data) {
    console.log("done: "+ data);
  });

  // $.ajax('http://foaas.com/donut/bri/riley', {
  //   type: "GET",
  //   success: function(data) {
  //     console.log(data);
  //   }
  // });

});