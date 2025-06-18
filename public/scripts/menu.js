let oudeScrollPositie = window.scrollY;

document.addEventListener('scroll', () => {
  const huidigeScrollPositie = window.scrollY;
  const logoHeader = document.querySelector('nav.top');
  const progressBar = document.querySelector('.progress');

  if (oudeScrollPositie > huidigeScrollPositie) {

    // wanneer de gebruiker omhoog scrollt laat menu zien
    logoHeader.classList.remove('hide');
    progressBar.classList.remove('hide');
  } else {

    // wanneer de gebruiker omlaag scrollt hide menu
    logoHeader.classList.add('hide');
    progressBar.classList.add('hide');
  }

  // Update de scrollpositie
  oudeScrollPositie = huidigeScrollPositie;
});
