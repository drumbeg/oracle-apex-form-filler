function populatePage (methodName, action) {
   chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(
         tabs[0].id,
         {method: methodName, action: action}
      );
   });
}

chrome.contextMenus.create({
   "id": "clear",
   "title": "Clear Fields",
   "contexts": ["all"]
});

chrome.contextMenus.create({
   "id": "fill",
   "title": "Fill Page",
   "contexts": ["all"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
   populatePage(info.menuItemId);
});