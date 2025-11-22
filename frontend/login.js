document.getElementById("loginBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    try {
        const response = await fetch("http://localhost/wildtrack_db/backend/api/auth/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.status === "success") {
            alert("Login successful!");

            // Save user info in browser storage
            localStorage.setItem("user", JSON.stringify(result.data));

            // Redirect to dashboard
            window.location.href = "modules.html";
        } else {
            alert(result.message);
        }

    } catch (error) {
        console.error(error);
        alert("Server is not responding. Check backend!");
    }
});
