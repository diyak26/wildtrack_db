<?php

$DB_HOST = '127.0.0.1';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'wildtrack_db';

// Create connection (NO named arguments)
$mysqli = mysqli_connect($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
$conn = $mysqli; // Alias for compatibility

// Check connection
if (!$mysqli) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . mysqli_connect_error()
    ]);
    exit;
}

// Set UTF-8
mysqli_set_charset($mysqli, 'utf8mb4');
?>
