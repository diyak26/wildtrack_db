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

// Suppress PHP errors from being displayed
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

// Check database connection
if (!isset($mysqli) || !$mysqli) {
    send_json(["success" => false, "error" => "Database connection failed"], 500);
}

$data = json_decode(file_get_contents("php://input"), true);

// Check if JSON decode failed
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    send_json(["success" => false, "error" => "Invalid JSON data"], 400);
}

// Validate required fields
if (empty($data["animal_id"])) {
    send_json(["success" => false, "error" => "animal_id is required"], 400);
}

// Check if status column exists, if not, don't include it in INSERT
$checkColumn = mysqli_query($mysqli, "SHOW COLUMNS FROM Threat_Alert LIKE 'status'");
$hasStatusColumn = mysqli_num_rows($checkColumn) > 0;

if ($hasStatusColumn) {
    $sql = "INSERT INTO Threat_Alert 
            (animal_id, type, severity, reported_date, action, status) 
            VALUES (?, ?, ?, ?, ?, ?)";
} else {
    $sql = "INSERT INTO Threat_Alert 
            (animal_id, type, severity, reported_date, action) 
            VALUES (?, ?, ?, ?, ?)";
}

$stmt = mysqli_prepare($mysqli, $sql);
if (!$stmt) {
    send_json(["success" => false, "error" => "Database error: " . mysqli_error($mysqli)], 500);
}

$reported_date = $data["reported_date"] ?? date("Y-m-d");

if ($hasStatusColumn) {
    $status = $data["status"] ?? "active";
    mysqli_stmt_bind_param(
        $stmt,
        "isssss",
        $data["animal_id"],
        $data["type"] ?? null,
        $data["severity"] ?? null,
        $reported_date,
        $data["action"] ?? null,
        $status
    );
} else {
    mysqli_stmt_bind_param(
        $stmt,
        "issss",
        $data["animal_id"],
        $data["type"] ?? null,
        $data["severity"] ?? null,
        $reported_date,
        $data["action"] ?? null
    );
}

$ok = mysqli_stmt_execute($stmt);

if (!$ok) {
    $error = mysqli_error($mysqli);
    mysqli_stmt_close($stmt);
    send_json(["success" => false, "error" => "Database error: " . $error], 500);
}

mysqli_stmt_close($stmt);
send_json(["success" => true, "message" => "Threat alert created successfully"]);
?>

