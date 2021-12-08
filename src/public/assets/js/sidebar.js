const a = document.getElementsByClassName('btn-light');
const uri = window.location.href;
for (let e of a) {
  if (e.href === uri) {
    e.childNodes[0].classList.remove('icli');
    e.childNodes[0].classList.add('icbo');
  }
}
