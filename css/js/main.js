document.addEventListener("DOMContentLoaded", function () {
    const mobileMenu = document.querySelector(".mobile-menu");
    const sidebar = document.querySelector(".sidebar");
    if (mobileMenu && sidebar) {
        mobileMenu.addEventListener("click", function (event) {
            event.preventDefault();
            sidebar.classList.toggle("mobile-open");
        });
    }

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".sidebar-link").forEach(function (link) {
        const href = link.getAttribute("href");
        if (href === currentPage) link.classList.add("active");
    });
});
