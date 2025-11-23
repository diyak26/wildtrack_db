<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

// Check database connection
if (!isset($mysqli) || !$mysqli) {
    error("Database connection failed: " . (isset($db_connection_error) ? $db_connection_error : "Unknown error"), 500);
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$data = json_decode(file_get_contents("php://input"), true);

// Check if JSON decode failed
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    error("Invalid JSON data", 400);
}

// Get fields safely
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

// Validation
if ($username === '' || $password === '') {
    error("Username and password are required", 422);
}

// Fetch user
$sql = "SELECT id, username, email, password_hash, role FROM users WHERE username = ?";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    error("Database error: " . mysqli_error($conn), 500);
}

mysqli_stmt_bind_param($stmt, "s", $username);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);

if (!$user) {
    error("Invalid username or password", 401);
}

// Verify password
if (!password_verify($password, $user['password_hash'])) {
    error("Invalid username or password", 401);
}

// Create session
$_SESSION["user_id"] = $user["id"];
$_SESSION["username"] = $user["username"];
$_SESSION["role"] = $user["role"];

// Success response
success([
    "user_id" => $user['id'],
    "username" => $user['username'],
    "email" => $user['email'],
    "role" => $user['role']
], "Login successful");
