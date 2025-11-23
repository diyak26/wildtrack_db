document.getElementById("registerBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !email || !password) {
        alert("Please fill in all fields");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }

    try {
        const response = await fetch("http://localhost/WILDTRACK_DB/backend/api/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const result = await response.json();

        if (result.status === "success") {
            alert("Registration successful! Please login.");
            window.location.href = "login.html";
        } else {
            alert(result.message || "Registration failed");
        }
    } catch (error) {
        alert("Connection error: " + error.message);
    }
});
