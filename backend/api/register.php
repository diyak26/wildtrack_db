<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

if (!isset($mysqli) || !$mysqli) {
    send_json(["status" => "error", "message" => "Database connection failed"], 500);
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    send_json(["status" => "error", "message" => "Invalid JSON data"], 400);
}

$username = trim($data['username'] ?? '');
$email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$password = $data['password'] ?? '';

if (empty($username) || !$email || strlen($password) < 6) {
    send_json(["status" => "error", "message" => "Username, valid email, and password (min 6 characters) are required"], 400);
}

// Check if username or email already exists
$sql = "SELECT id FROM users WHERE username=? OR email=?";
$stmt = mysqli_prepare($mysqli, $sql);
if (!$stmt) {
    send_json(["status" => "error", "message" => "Database error: " . mysqli_error($mysqli)], 500);
}

mysqli_stmt_bind_param($stmt, "ss", $username, $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) > 0) {
    mysqli_stmt_close($stmt);
    send_json(["status" => "error", "message" => "Username or email already exists"], 400);
}
mysqli_stmt_close($stmt);

// Create new user
$hash = password_hash($password, PASSWORD_DEFAULT);
$sql = "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'staff')";
$stmt = mysqli_prepare($mysqli, $sql);
if (!$stmt) {
    send_json(["status" => "error", "message" => "Database error: " . mysqli_error($mysqli)], 500);
}

mysqli_stmt_bind_param($stmt, "sss", $username, $email, $hash);

if (!mysqli_stmt_execute($stmt)) {
    mysqli_stmt_close($stmt);
    send_json(["status" => "error", "message" => "Database error: " . mysqli_error($mysqli)], 500);
}

$newId = mysqli_insert_id($mysqli);
mysqli_stmt_close($stmt);
send_json(["status" => "success", "message" => "User registered successfully", "data" => ["user_id" => $newId]]);
?>
