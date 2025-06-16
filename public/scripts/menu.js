let oudeScrollPositie = window.scrollY;

document.addEventListener('scroll', () => {
  const huidigeScrollPositie = window.scrollY;
  const logoHeader = document.querySelector('nav.top');

  if (oudeScrollPositie > huidigeScrollPositie) {

    // wanneer de gebruiker omhoog scrollt laat menu zien
    logoHeader.classList.remove('hide');
  } else {

    // wanneer de gebruiker omlaag scrollt hide menu
    logoHeader.classList.add('hide');
  }

  // Update de scrollpositie
  oudeScrollPositie = huidigeScrollPositie;
});
