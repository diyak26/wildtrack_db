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

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    send_json(["status" => "error", "message" => "Invalid JSON data"], 400);
}

$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    send_json(["status" => "error", "message" => "Username and password are required"], 400);
}

$sql = "SELECT id, username, email, password_hash, role FROM users WHERE username = ?";
$stmt = mysqli_prepare($mysqli, $sql);
if (!$stmt) {
    send_json(["status" => "error", "message" => "Database error: " . mysqli_error($mysqli)], 500);
}

mysqli_stmt_bind_param($stmt, "s", $username);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);

if (!$user || !password_verify($password, $user['password_hash'])) {
    send_json(["status" => "error", "message" => "Invalid username or password"], 401);
}

$_SESSION["user_id"] = $user["id"];
$_SESSION["username"] = $user["username"];
$_SESSION["role"] = $user["role"];

send_json([
    "status" => "success",
    "message" => "Login successful",
    "data" => [
        "user_id" => $user['id'],
        "username" => $user['username'],
        "email" => $user['email'],
        "role" => $user['role']
    ]
]);
?>
