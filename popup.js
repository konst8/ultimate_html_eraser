document.addEventListener("DOMContentLoaded", function(event) {
  const button = document.querySelector('input[type="submit"]');
  button.addEventListener('click', event => {
    const exclude = document.querySelector('input[type="text"]').value;
    const message = {
      eraseHtmlElements: {
        exclude
      }
    };    
    chrome.tabs.query({active: true, currentWindow: true}, activeTabs => {
      const tabId = activeTabs[0].id;
      const response = () => {};
      chrome.tabs.sendMessage(tabId, message, {}, response);
    });
    chrome.runtime.sendMessage(message);
  });
});