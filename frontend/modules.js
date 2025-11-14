// highlight Modules page
document.querySelectorAll("nav a").forEach(a => {
    if (a.href.includes("modules.html")) {
        a.classList.add("active");
    }
});
