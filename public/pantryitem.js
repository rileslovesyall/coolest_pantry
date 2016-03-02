var addItemForm = function () {
  var formHtml = "";
  formHtml +=
    "<form class='addForm'>" +
      "<fieldset class='form-group'>" +
        "<label for='name'>Name: </label>" +
        "<input class='form-control' for='name' id='name' type='text' name='name' required>" +
        "<label for='description'>Description </label>" +
        "<input class='form-control for='description' id='description' name='description'>" +
        "<label for='portion-size'>Portion Size: </label>" +
        "<div class='form-note'>(i.e. Gallon, Quart, Pint, Cup etc.)</div>" +
        "<input class='form-control' name = 'portion-size' for='portion-size' id='portion-size' required>" +
        "<label for='quantity'>Quantity: </label> " +
        "<input class='form-control' for='quantity' id='quantity' type='number' name='quantity' required>" +
        "<label for='ingredients'>Ingredients: </label>" +
        "<div class='form-note'>(please separate with a comma)</div>" +
        "<input class='form-control' for='ingredients' id='ingredients' name='ingredients'>" +
      "</fieldset>" +
      "<button class='submit btn btn-default'>Submit</button>" +
    "</form>";
  $('.formHolder').html(formHtml);
};

$(document).ready(function () {
  addItemForm();

  $('.formHolder').on('click', '.submit', function () {
    event.preventDefault();
    console.log('form is done.');
    console.log($('form.addForm').serialize());
  });

});