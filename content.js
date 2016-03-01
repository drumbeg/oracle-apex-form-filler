/*global chrome, moment*/
var richTextHandler = function (context) {
   $('textarea.rich_text_editor', context).each(function (i, e) {
      var label = $("label[for='" + this.id + "']", context).text().trim() || 'iframe ' + i;
      $(e).parent().find('iframe').contents().find('body').html('<p>Test data for ' + label + '</p>')
   });
};

var inputHandler = function (selector, context) {
   $(selector, context).each(function () {
      var val = $("label[for='" + this.id + "']", context).text().trim() || 'Test Data';
      var maxLength = $(this).attr('maxlength') || 200;
      val = val.substring(0, maxLength - 1);
      $(this).val(val);
   });
};

chrome.runtime.onMessage.addListener(function (request, sender, response) {
   console.log('Method Received ' + request.method);

   var isDialogOpen = $('.ui-dialog:visible').length > 0;
   var rootSelector = isDialogOpen ? $('.ui-dialog:visible').find('iframe').contents() : $(document);

   switch (request.method) {
      case 'clear':
         // Text Area, Text Field, Date Picker
         $('textarea:visible, input[type="text"]:visible, .datepicker:visible', rootSelector).val('');

         // Rich Text
         $('iframe', 'textarea.rich_text_editor').contents().find('body').html('');

         // Select List
         $('select:visible option:first-child', rootSelector)
            .prop("selected", true);
         break;
      default:
         // Text Area & Rich Text
         inputHandler('textarea:visible', rootSelector);
         richTextHandler(rootSelector);

         // Text Field
         inputHandler('input[type="text"]:not(.datepicker):visible', rootSelector);

         // Date Picker
         $('.datepicker:visible', rootSelector)
            .val(moment()
            .format('DD-MMM-YYYY'));

         // Select List
         $('select:visible option:last-child', rootSelector)
            .prop("selected", true);
      }
});