<?php
// backend/config/db.php
header('Content-Type: application/json; charset=utf-8');

// Edit DB credentials if needed
$DB_HOST = '127.0.0.1';
$DB_NAME = 'wildtrack_db';
$DB_USER = 'root';
$DB_PASS = ''; // XAMPP default is empty

try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'DB connection failed: ' . $e->getMessage()]);
    exit;
}
