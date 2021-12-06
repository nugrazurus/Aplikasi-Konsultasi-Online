const a = document.getElementsByClassName('btn-light');
console.log(a);
const uri = window.location.href;
console.log(uri);
for (let e of a) {
  if (e.href === uri) {
    console.log(e.href);
    e.childNodes[0].classList.remove('icli');
    e.childNodes[0].classList.add('icbo');
  }
}
