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

$data = json_decode(file_get_contents("php://input"), true);

// Check if JSON decode failed
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    error("Invalid JSON data", 400);
}

$username = trim($data['username'] ?? '');
$email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$password = $data['password'] ?? '';

if (!$username || !$email || strlen($password) < 6) {
    error("Invalid input. Username, valid email, and password (min 6 characters) are required", 422);
}

// Check duplicate
$sql = "SELECT id FROM users WHERE username=? OR email=?";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    error("Database error: " . mysqli_error($conn), 500);
}

mysqli_stmt_bind_param($stmt, "ss", $username, $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
if (mysqli_num_rows($result) > 0) {
    mysqli_stmt_close($stmt);
    error("Username or email already exists", 409);
}
mysqli_stmt_close($stmt);

$hash = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'staff')";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    error("Database error: " . mysqli_error($conn), 500);
}

mysqli_stmt_bind_param($stmt, "sss", $username, $email, $hash);

if (mysqli_stmt_execute($stmt)) {
    $newId = mysqli_insert_id($conn);
    mysqli_stmt_close($stmt);
    success(["user_id" => $newId], "User registered successfully", 201);
} else {
    error("Database error: " . mysqli_stmt_error($stmt), 500);
}
