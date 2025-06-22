// als de pagina geladen is
document.addEventListener("DOMContentLoaded", () => {

    // selecteer het contactformulier in de footer
    const contactForm = document.querySelector('.btm-section');

    // animatie toevoegen aan het formulier
    contactForm.classList.add('slide-up');

    // check wanneer het contactformulier in beeld komt of uit beeld gaat
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {

            // als het formlier zichtbaar is
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            // als het formulier niet zichtbaar is
            } else {
                entry.target.classList.remove('visible');
            }
        });
    });

    // check dan opnieuw de positie van het formulier
    observer.observe(contactForm);
});