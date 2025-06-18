let oldScrollPosition = window.scrollY;

document.addEventListener('scroll', () => {
  const currentScrollPosition = window.scrollY;
  const logoHeader = document.querySelector('nav.top');
  const progressBar = document.querySelector('.progress');

  if (oldScrollPosition > currentScrollPosition) {
    logoHeader.classList.remove('hide');
    if (progressBar) {
      progressBar.classList.remove('hide');
    }
  } else {
    logoHeader.classList.add('hide');
    if (progressBar) {
      progressBar.classList.add('hide');
    }
  }

  oldScrollPosition = currentScrollPosition;
});
