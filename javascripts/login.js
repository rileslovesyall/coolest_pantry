$(document ).ready(function() {
    $('.btn').click(function (){
      $.post('http://localhost:9393/api/v1/token', {
        email: params['email'],
        password: params['password']
      })
      .done(function (data) {
        console.log(data);
        // document.cookie = ""data['token'] + ;
        document.location.href = '/index.html';
      })
      .fail(function (data){
        console.log(data);
        console.log('failed');
      });
    });
});