const storageType = 'sync';
const storageArea = chrome.storage[storageType];

document.addEventListener("DOMContentLoaded", function(event) {
  const button = document.querySelector('input[type="submit"]');
  const excludeSelector = document.querySelector('input[type="text"]');

  storageArea.get(storage => {
    const excludeValue = storage.excludeValue || null;
    if (excludeValue) {
      excludeSelector.value = excludeValue;
    }
  });

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
    // chrome.runtime.sendMessage(message);
  });
});