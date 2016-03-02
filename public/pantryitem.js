var addItemForm = function () {
  var formHtml = "";
  formHtml +=
    "<form>" +
      "<fieldset class='form-group'>" +
        "<label for='name'>Name: </label>" +
        "<input class='form-control' for='name' id='name' type='text'>" +
        "<label for='description'>Description </label>" +
        "<input class='form-control for='description' id='description'>" +
        "<label for='portion-size'>Portion Size: </label>" +
        "<input class='form-control' for='portion-size' id='portion-size'>" +
        "<label for='quantity'>Quantity: </label> " +
        "<input class='form-control' for='quantity' id='quantity' type='number'>" +
      "<button class='btn btn-default'>Submit</button>";
  $('.form').html(formHtml);
};

$(document).ready(function () {
  addItemForm();
});