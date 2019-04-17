document.addEventListener('click', handler, false);

function handler(event) {
    let elt = document.querySelector('body');
      
    if (event.target !== elt && !elt.contains(event.target)) {
        document.removeEventListener('click', handler, false);
    }
}
