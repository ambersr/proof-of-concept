  // variabele oude verticale scrollpositie
  let oldScrollPosition = window.scrollY;

// wanneer je scrollt op de pagina
document.addEventListener('scroll', () => {

  // de nieuwe scrollpositie
  const currentScrollPosition = window.scrollY;

  // selecteer de header met logo en de progressbar
  const logoHeader = document.querySelector('nav.top');
  const progressBar = document.querySelector('.progress');

  // als je omhoog scrollt
  if (oldScrollPosition > currentScrollPosition) {
    logoHeader.classList.remove('hide');
    progressBar.classList.remove('hide');

  // als je omlaag scrollt
  } else {
    logoHeader.classList.add('hide');
    progressBar.classList.add('hide');
  }

  // nieuwe scrollpositie
  oldScrollPosition = currentScrollPosition;
});
