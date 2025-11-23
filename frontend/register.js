document.getElementById("registerBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    try {
        const url = "http://localhost/WILDTRACK_DB/backend/api/register.php";
        console.log("Attempting registration to:", url);
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Response error:", errorText);
            try {
                const errorJson = JSON.parse(errorText);
                alert(errorJson.message || `Error: ${response.status}`);
            } catch {
                alert(`Server error (${response.status}). Check console for details.`);
            }
            return;
        }

        const result = await response.json();
        console.log("Registration result:", result);

        if (result.status === "success") {
            alert("Registration successful! Please login with your credentials.");
            window.location.href = "login.html";
        } else {
            alert(result.message || "Registration failed. Please try again.");
        }

    } catch (error) {
        console.error("Registration error:", error);
        alert("Connection failed: " + error.message + ". Check if backend server is running.");
    }
});

