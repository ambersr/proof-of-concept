document.addEventListener("DOMContentLoaded", function () {
    const popupBtn = document.querySelector(".popup-btn");
    const bottomNav = document.querySelector(".header-mobile .bottom");

    popupBtn.addEventListener("click", function () {
        bottomNav.classList.toggle("popup");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const dropdownButtons = document.querySelectorAll(".dropdown-btn");

    dropdownButtons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault(); // voorkomt dat href wordt gevolgd

            const parentLi = btn.closest(".menu-item");
            const submenu = parentLi.querySelector(".sub-menu");

            submenu.classList.toggle("open");
        });
    });
});