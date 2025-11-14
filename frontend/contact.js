// Highlight Contact in navbar
document.querySelectorAll("nav a").forEach(link => {
    if (link.href.includes("contact.html")) {
        link.classList.add("active");
    }
});
