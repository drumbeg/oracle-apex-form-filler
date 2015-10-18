/*global chrome*/
var notify = function (data) {
   chrome.notifications.create(
      '',
      {
         type: 'basic',
         iconUrl: 'apex.png',
         title: data.title,
         message: data.length + ' items updated'
      }
   );
};

var makeRequest = function (methodName, action) {
   chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(
         tabs[0].id,
         {method: methodName, action: action},
         notify
      );
   });
};

$(document).ready(function () {
   $('a').click(function () {
      makeRequest($(this).data('method'), $(this).data('action'));
   });
});