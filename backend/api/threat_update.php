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

if (empty($data["alert_id"])) {
    send_json(["success" => false, "error" => "alert_id is required"], 400);
}

// Check table name (case-insensitive)
$tableCheck = mysqli_query($mysqli, "SHOW TABLES LIKE 'threat_alert'");
if (mysqli_num_rows($tableCheck) == 0) {
    $tableCheck = mysqli_query($mysqli, "SHOW TABLES LIKE 'Threat_Alert'");
    if (mysqli_num_rows($tableCheck) == 0) {
        send_json(["success" => false, "error" => "Threat_Alert table does not exist"], 500);
    }
    $tableName = "Threat_Alert";
} else {
    $tableName = "threat_alert";
}

// Check if status column exists
$checkColumn = mysqli_query($mysqli, "SHOW COLUMNS FROM `$tableName` LIKE 'status'");
if (!$checkColumn) {
    send_json(["success" => false, "error" => "Error checking columns: " . mysqli_error($mysqli)], 500);
}
$hasStatusColumn = mysqli_num_rows($checkColumn) > 0;

// Don't include action column in UPDATE
// Note: 'type' is a reserved keyword, so we use backticks
if ($hasStatusColumn) {
    $sql = "UPDATE `$tableName` SET 
            animal_id=?, 
            `type`=?, 
            severity=?, 
            reported_date=?, 
            status=?
            WHERE alert_id=?";
} else {
    $sql = "UPDATE `$tableName` SET 
            animal_id=?, 
            `type`=?, 
            severity=?, 
            reported_date=?
            WHERE alert_id=?";
}

$stmt = mysqli_prepare($mysqli, $sql);
if (!$stmt) {
    send_json(["success" => false, "error" => "Database error: " . mysqli_error($mysqli)], 500);
}

// Prepare variables for binding (must be variables, not expressions)
$animal_id = intval($data["animal_id"]);
$type = $data["type"] ?? null;
$severity = $data["severity"] ?? null;
$reported_date = $data["reported_date"] ?? null;
$alert_id = intval($data["alert_id"]);

if ($hasStatusColumn) {
    $status = $data["status"] ?? "active";
    mysqli_stmt_bind_param(
        $stmt,
        "issssi",
        $animal_id,
        $type,
        $severity,
        $reported_date,
        $status,
        $alert_id
    );
} else {
    mysqli_stmt_bind_param(
        $stmt,
        "isssi",
        $animal_id,
        $type,
        $severity,
        $reported_date,
        $alert_id
    );
}

$ok = mysqli_stmt_execute($stmt);

if (!$ok) {
    $error = mysqli_error($mysqli);
    mysqli_stmt_close($stmt);
    send_json(["success" => false, "error" => "Database error: " . $error], 500);
}

mysqli_stmt_close($stmt);
send_json(["success" => true, "message" => "Threat alert updated successfully"]);
?>

