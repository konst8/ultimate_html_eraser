const getTree = element => {
  const domElements = document.querySelectorAll(element);
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

const eraseHtmlElements = (exclude='') => {
  const elements = document.querySelectorAll('*');
  const excludeTree = getTree(exclude);
  elements.forEach(element => {
    if (excludeTree.includes(element)) return;
    element.remove();
  });
};

chrome.runtime.onMessage.addListener((message, sender, response) => {
  Object.keys(message).forEach(key => {
    const value = message[key];
    switch(key) {
      case 'eraseHtmlElements':
        eraseHtmlElements(value.exclude);
        break;
      default: 
        console.log(key, value);
    }
  });
});