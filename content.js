/*global chrome, moment*/
var $selection;
var message;

var richTextHandler = function (context) {
   $selection.add('textarea.rich_text_editor', context);
   $selection.each(function (i, e) {
      var label = $("label[for='" + this.id + "']", context).text().trim() || 'iframe ' + i;
      $(e).parent().find('iframe').contents().find('body').html('<p>Test data for ' + label + '</p>')
   });
};

var inputHandler = function (selector, context) {
   $selection = $(selector, context);
   $selection.each(function () {
      var val = $("label[for='" + this.id + "']", context).text().trim() || 'Test Data';
      var maxLength = $(this).attr('maxlength') || 200;
      val = val.substring(0, maxLength - 1);
      $(this).val(val);
   });
};

chrome.runtime.onMessage.addListener(function (request, sender, response) {
   console.log('Method Received ' + request.method);

   $selection = $();
   var isDialogOpen = $('.ui-dialog:visible').length > 0;
   var rootSelector = isDialogOpen ? $('.ui-dialog:visible').find('iframe').contents() : $(document);

   switch (request.method) {
      case 'clear':
         $selection = $('textarea:visible, input[type="text"]:visible, .datepicker:visible', rootSelector);
         $selection.val('');
         $selection = $selection.add('iframe', 'textarea.rich_text_editor');
         $('iframe', 'textarea.rich_text_editor').contents().find('body').html('');
         break;
      default:
   // ta:
      inputHandler('textarea:visible', rootSelector);
      richTextHandler(rootSelector);
   // tf:
      inputHandler('input[type="text"]:not(.datepicker):visible', rootSelector);
   // df:
      $selection = $('.datepicker:visible', rootSelector);
      $selection.val(moment().format('DD-MMM-YYYY'));
   // rb:
      $selection = $('.radio_group input[type="radio"]:visible:first', rootSelector);
      $selection.prop('checked', true);
   // cb:
      $selection = $('input[type="checkbox"]:visible', rootSelector);
      $selection.prop('checked', !$selection.prop("checked"));
   // lsl:
      $selection = $('select:visible option:last-child', rootSelector);
      $($selection).prop("selected", true);
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