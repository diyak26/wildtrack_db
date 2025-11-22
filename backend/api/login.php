<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/sanitize.php';
require_once __DIR__ . '/../../helpers/auth.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$data = json_decode(file_get_contents("php://input"), true);

// get fields safely
$username = clean_string($data['username'] ?? '');
$password = $data['password'] ?? '';

// validation
if ($username === '' || $password === '') {
    error("Username and password are required", 422);
}

// fetch user
$stmt = $conn->prepare("SELECT id, username, email, password_hash, role FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    error("Invalid username or password", 401);
}

// verify password
if (!password_verify($password, $user['password_hash'])) {
    error("Invalid username or password", 401);
}

// create session
$_SESSION["user_id"] = $user["id"];
$_SESSION["username"] = $user["username"];
$_SESSION["role"] = $user["role"];

// success response
success([
    "user_id" => $user['id'],
    "username" => $user['username'],
    "email" => $user['email'],
    "role" => $user['role']
], "Login successful");
