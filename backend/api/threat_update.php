<?php
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
    send_json(["success" => false, "error" => "Database connection failed"], 500);
}

$data = json_decode(file_get_contents("php://input"), true);

// Check if JSON decode failed
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    send_json(["success" => false, "error" => "Invalid JSON data"], 400);
}

// Validate required fields
if (empty($data["alert_id"])) {
    send_json(["success" => false, "error" => "alert_id is required"], 400);
}

// Prepare variables
$animal_id = intval($data["animal_id"]);
$type = $data["type"] ?? null;
$severity = $data["severity"] ?? null;
$reported_date = $data["reported_date"] ?? null;
$status = $data["status"] ?? "active";
$alert_id = intval($data["alert_id"]);

$sql = "UPDATE threat_alert 
        SET animal_id=?, `type`=?, severity=?, reported_date=?, status=?
        WHERE alert_id=?";

$stmt = mysqli_prepare($mysqli, $sql);
if (!$stmt) {
    send_json(["success" => false, "error" => "Database error: " . mysqli_error($mysqli)], 500);
}

mysqli_stmt_bind_param($stmt, "issssi", $animal_id, $type, $severity, $reported_date, $status, $alert_id);

$ok = mysqli_stmt_execute($stmt);

if (!$ok) {
    $error = mysqli_error($mysqli);
    mysqli_stmt_close($stmt);
    send_json(["success" => false, "error" => "Database error: " . $error], 500);
}

mysqli_stmt_close($stmt);
send_json(["success" => true, "message" => "Threat alert updated successfully"]);
?>
