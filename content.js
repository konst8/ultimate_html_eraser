const storageType = 'sync';
const storageArea = chrome.storage[storageType];

const hostname = window.location.hostname;
const pathname = window.location.pathname;

const getTree = (element, context) => {
  const domElements = context.querySelectorAll(element);
  // Build tree of current element - its parents and children.
  let treeElements = [];
  domElements.forEach(domElement => {
    const childElements = domElement.querySelectorAll('*');
    while (domElement) {
      treeElements.unshift(domElement);
      domElement = domElement.parentNode;
    }
    treeElements = treeElements.concat(Array.from(childElements));
  });
  return treeElements.length ? treeElements : null;
};

const eraseHtmlElements = (exclude='', context) => {
  const elements = context.querySelectorAll('*');
  const excludeTree = getTree(exclude, context);
  elements.forEach(element => {
    if (excludeTree.includes(element)) return;
    element.remove();
  });
  return context;
};

const httpGet = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
};

chrome.runtime.onMessage.addListener((message, sender, response) => {
  console.log(message);
  Object.keys(message).forEach(key => {
    const value = message[key];
    switch(key) {
      case 'eraseHtmlElements':
        if (value.exclude !== '') {
          eraseHtmlElements(value.exclude, document);
          storageArea.set({
            [hostname]: {
              [pathname]: value.exclude
            }
          });
        } else {
          eraseHtmlElements('*', document);
          storageArea.set({
            [hostname]: {
              [pathname]: null
            }
          });
        }
        break;
      default: 
        console.log(key, value);
    }
  });
});

storageArea.get([hostname], async storage => {
  console.log(storage);
  const excludeValue = storage[hostname][pathname] || null;
  console.log(excludeValue);
  if (excludeValue) {
      console.log(excludeValue)
      window.stop();
      const html = document.getElementsByTagName('html');
      html[0].remove();
      const documentString = await httpGet(location.href);
      //console.log(documentString);
      const parser = new DOMParser();
      const parsedDocument = parser.parseFromString(documentString, "text/html");
      const sanitizedDocument = eraseHtmlElements(excludeValue, parsedDocument);
      //console.log('documentString', documentString);
      //console.log('sanitizedDocument', sanitizedDocument);
      document.write(sanitizedDocument.documentElement.outerHTML);
      //document.appendChild(sanitizedDocument.getElementsByTagName('html')[0]);
    //eraseHtmlElements(excludeValue);
    // const html = document.getElementsByTagName('html');
    // html[0].remove();
    // console.log('html', html);
  }
});

// const needsErase = (() => {
//   let status = true;
//   const getStatus = () => status;
//   const on = () => {
//     status = true;
//   };
//   const off = () => {
//     status = false;
//   };
//   return {
//     getStatus,
//     on,
//     off
//   };
// })();

// if (typeof localStorage.ultimateHtmlEraser !== "undefined") {
//   const eraseParameters = JSON.parse(localStorage.ultimateHtmlEraser);
//   //console.log('localStorage.ultimateHtmlEraser.selector', localStorage.ultimateHtmlEraser.selector);
//   const message = {
//     url: window.location.href,
//     selector: eraseParameters.selector,
//     mode: eraseParameters.mode || 'erase',
//   };
//   chrome.runtime.sendMessage({contentScript: JSON.stringify(message)});
// }

// storageArea.get(storage => {
//   window.stop();
//   console.log('hoho');
// });

// document.addEventListener("DOMContentLoaded", function(event) {
//   document.body = document.createElement('body');
//   document.body.innerHTML = "<h1>HohohOHOHOHOO!</h1>";
// });