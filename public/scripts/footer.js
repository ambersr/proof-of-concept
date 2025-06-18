document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector('.btm-section');

    // Voeg animatieklasse alleen toe als JS werkt
    section.classList.add('slide-up');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    });

    observer.observe(section);
});