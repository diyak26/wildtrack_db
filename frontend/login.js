document.getElementById("loginBtn").onclick = function () {
    let user = document.getElementById("username").value.trim();
    let pass = document.getElementById("password").value.trim();

    if (user === "" || pass === "") {
        alert("Please enter both username and password.");
        return;
    }

    // Simple demo login
    if (user === "admin" && pass === "admin123") {
        alert("Login successful!");
        window.location.href = "modules.html";  // Redirect to dashboard
    } else {
        alert("Invalid username or password.");
    }
};
