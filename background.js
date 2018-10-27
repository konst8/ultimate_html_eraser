const httpGet = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
};

let contentMessage = '';

chrome.runtime.onMessage.addListener(function(request, sender, response) {
  const sendEraseParameters = (tab) => {
    chrome.tabs.sendMessage(tab.id, {eraseParameters: "hoho"});
  };
  console.log(Object.keys(request));
  if (Object.keys(request)[0] === 'contentScript'){
    chrome.tabs.create({url: chrome.extension.getURL("blank.html")});
    console.log(request);
    contentMessage = request.contentScript;
  } else {
    response({contentMessage});
  };
});