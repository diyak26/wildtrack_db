<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

// Check database connection
if (!isset($mysqli) || !$mysqli) {
    error("Database connection failed: " . (isset($db_connection_error) ? $db_connection_error : "Unknown error"), 500);
}

// Default admin user credentials
$default_username = "admin";
$default_email = "admin@wildtrack.com";
$default_password = "admin123"; // Change this after first login!
$default_role = "admin";

// Check if admin user already exists
$sql = "SELECT id FROM users WHERE username = ? OR email = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "ss", $default_username, $default_email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) > 0) {
    mysqli_stmt_close($stmt);
    success([
        "username" => $default_username,
        "password" => $default_password,
        "message" => "Default user already exists. Use these credentials to login."
    ], "Default user already exists");
}

mysqli_stmt_close($stmt);

// Create password hash
$password_hash = password_hash($default_password, PASSWORD_DEFAULT);

// Insert default admin user
$sql = "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    error("Database error: " . mysqli_error($conn), 500);
}

mysqli_stmt_bind_param($stmt, "ssss", $default_username, $default_email, $password_hash, $default_role);

if (mysqli_stmt_execute($stmt)) {
    $newId = mysqli_insert_id($conn);
    mysqli_stmt_close($stmt);
    success([
        "user_id" => $newId,
        "username" => $default_username,
        "password" => $default_password,
        "role" => $default_role,
        "message" => "Default admin user created successfully!"
    ], "Default user created");
} else {
    error("Database error: " . mysqli_stmt_error($stmt), 500);
}
?>

