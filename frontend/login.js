document.getElementById("loginBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }

    try {
        const response = await fetch("http://localhost/WILDTRACK_DB/backend/api/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.status === "success") {
            localStorage.setItem("user", JSON.stringify(result.data));
            window.location.href = "modules.html";
        } else {
            alert(result.message || "Login failed");
        }
    } catch (error) {
        alert("Connection error: " + error.message);
    }
});
