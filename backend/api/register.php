<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/sanitize.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = sanitize($data['username'] ?? '');
$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$password = $data['password'] ?? '';

if (!$username || !$email || strlen($password) < 6) {
    error("Invalid input", 422);
}

// check duplicate
$stmt = $conn->prepare("SELECT id FROM users WHERE username=? OR email=?");
$stmt->bind_param("ss", $username, $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    error("Username or email already exists", 409);
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'staff')");
$stmt->bind_param("sss", $username, $email, $hash);

if ($stmt->execute()) {
    success(["user_id" => $stmt->insert_id], "User registered successfully", 201);
} else {
    error("Database error", 500, ["details" => $stmt->error]);
}
