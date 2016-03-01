$(document ).ready(function() {
  
    $('.btn').click(function (){
      event.preventDefault();
      $.post('http://localhost:9393/api/v1/users',
        $('form').serialize())
      .done(function (data) {
        console.log(data);
        if (data['error'] === undefined) {
          localStorage.token = data['token'];
          localStorage.uid = data['uid'];
          localStorage.name = data['name'];
          document.location.href = './pantry.html';
        } else {
          console.log(data['error']);
        }
      })
      .fail(function (data){
        console.log('failed');
      });
      // .always(function() {
      //   console.log('always');
      // });
      console.log('this is the end of all this');
    });
});