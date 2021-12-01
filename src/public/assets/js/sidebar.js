const a = document.getElementsByClassName('btn-light');
console.log(a);
for (let e of a) {
  if (e.href === window.location.href) {
    e.childNodes[0].classList.remove('icli');
    e.childNodes[0].classList.add('icbo');
  }
}
