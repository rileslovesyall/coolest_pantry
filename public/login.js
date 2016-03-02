var submitLogin = function () {
  $('.login').click(function (){
    event.preventDefault();
    $.post('http://localhost:9393/api/v1/token',
      $('form').serialize())
    .done(function (data) {
      console.log(data);
      if (data['error'] === undefined) {
        localStorage.token = data['token'];
        localStorage.uid = data['uid'];
        localStorage.name = data['name'];
        document.location.href = '../lib/pantry.html';
      } else {
        console.log(data['error']);
      }
    })
    .fail(function (data){
      console.log('This failed. I should probably do something different here.');
    });
  });
};

$(document ).ready(function() {
  submitLogin();
});