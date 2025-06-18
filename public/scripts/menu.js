let oldScrollPosition = window.scrollY;

document.addEventListener('scroll', () => {
  const currentScrollPosition = window.scrollY;
  const logoHeader = document.querySelector('nav.top');
  const progressBar = document.querySelector('.progressbar');

  if (oldScrollPosition > currentScrollPosition) {

    // wanneer de gebruiker omhoog scrollt laat menu zien
    logoHeader.classList.remove('hide');
    progressBar.classList.remove('hide');
  } else {

    // wanneer de gebruiker omlaag scrollt hide menu
    logoHeader.classList.add('hide');
    progressBar.classList.add('hide');
  }

  // Update de scrollPosition
  oldScrollPosition = currentScrollPosition;
});
