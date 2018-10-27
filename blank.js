const httpGet = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
};

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

document.addEventListener("DOMContentLoaded", function(event) {
  chrome.runtime.sendMessage({blank: 'blank'}, {}, async (response) => {
    const eraseParameters = JSON.parse(response.contentMessage);
    console.log('eraseParameters', eraseParameters);
    const page = await httpGet(eraseParameters.url);
    const domParser = new DOMParser();
    const parsedDocument = domParser.parseFromString(page, "text/html");
    console.log(parsedDocument);
    const sanitizedDocument = eraseHtmlElements(eraseParameters.selector, parsedDocument);
    document.write(sanitizedDocument.documentElement.outerHTML);
    //console.log('page', page);
    // const updatedPage = eraseHtmlElements(eraseParameters.selector, parsedDocument);
    // document.body.innerHTML = updatedPage;
  });
});

// console.log('hello world!');
// chrome.runtime.onMessage.addListener(function(request, sender, response) {
//   console.log(request);
//   if(request.eraseParameters == "hoho") {
//     console.log('hoho');
//     document.body.innerHTML = "hohoho";
//   }
// });