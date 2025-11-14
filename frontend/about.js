// Highlight the active menu link
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {
    if (link.href.includes("about.html")) {
        link.classList.add("active");
    }
});
