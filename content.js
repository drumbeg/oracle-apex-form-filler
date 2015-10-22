/*global chrome, moment*/
var $selection;
var message;

var inputHandler = function (selector) {
   $selection = $(selector);
   $selection.each(function () {
      var val = $("label[for='" + this.id + "']").text().trim() || 'Test Data';
      var maxLength = $(this).attr('maxlength') || 200;
      val = val.substring(0, maxLength - 1);
      $(this).val(val);
   });
};

chrome.runtime.onMessage.addListener(function (request, sender, response) {
   console.log('Method Received ' + request.method);
   switch (request.method) {
   case 'ta':
      inputHandler('textarea:visible');
      break;
   case 'tf':
      inputHandler('input[type="text"]:not(.datepicker):visible');
      break;
   case 'df':
      $selection = $('.datepicker:visible');
      $selection.val(moment().format('DD-MMM-YYYY'));
      break;
   case 'rb':
      $selection = $('.radio_group input[type="radio"][value="' + request.action + '"]:visible');
      $selection.prop('checked', true);
      break;
   case 'cb':
      $selection = $('input[type="checkbox"]:visible');
      $selection.prop('checked', !$selection.prop("checked"));
      break;
   case 'lsl':
      $selection = $('select:visible option:last-child');
      $($selection).prop("selected", true);
      break;
   case 'clear':
      $selection = $('textarea:visible, input[type="text"]:visible, .datepicker:visible');
      $selection.val('');
      break;
   default:
      console.log(request.method + ' not supported');
   }

   if ($selection.length === 0) {
      message = 'Oops';
   } else if ($selection.length < 30) {
      message = 'Not bad';
   } else if ($selection.length < 100) {
      message = 'Wow';
   } else {
      message = "You're on fire!";
   }

   response({
      length: $selection.length,
      title: message
   });
});