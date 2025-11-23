<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Suppress PHP errors from being displayed
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

// Check database connection
if (!isset($mysqli) || !$mysqli) {
    send_json(["success" => false, "error" => "Database connection failed"], 500);
}

// Get status filter from query parameter (optional)
$statusFilter = $_GET["status"] ?? null;

// Check if Threat_Alert table exists (case-insensitive check)
$tableCheck = mysqli_query($conn, "SHOW TABLES LIKE 'threat_alert'");
if (mysqli_num_rows($tableCheck) == 0) {
    $tableCheck = mysqli_query($conn, "SHOW TABLES LIKE 'Threat_Alert'");
    if (mysqli_num_rows($tableCheck) == 0) {
        send_json(["success" => true, "data" => [], "message" => "Threat_Alert table does not exist yet"]);
    }
    $tableName = "Threat_Alert";
} else {
    $tableName = "threat_alert";
}

// Check which columns exist
$checkStatus = mysqli_query($conn, "SHOW COLUMNS FROM `$tableName` LIKE 'status'");
$checkAction = mysqli_query($conn, "SHOW COLUMNS FROM `$tableName` LIKE 'action'");
if (!$checkStatus || !$checkAction) {
    send_json(["success" => false, "error" => "Error checking table structure: " . mysqli_error($conn)], 500);
}
$hasStatusColumn = mysqli_num_rows($checkStatus) > 0;
$hasActionColumn = mysqli_num_rows($checkAction) > 0;

// Build SELECT clause based on available columns
$selectFields = "ta.alert_id, ta.animal_id, a.name AS animal_name, a.species, ta.type AS threat_type, ta.severity, ta.reported_date";
if ($hasActionColumn) {
    $selectFields .= ", ta.action";
} else {
    $selectFields .= ", NULL AS action";
}
if ($hasStatusColumn) {
    $selectFields .= ", COALESCE(ta.status, 'active') AS status";
} else {
    $selectFields .= ", 'active' AS status";
}
$selectFields .= ", a.zone_id, z.zone_name";

$sql = "SELECT " . $selectFields . "
        FROM `$tableName` ta
        LEFT JOIN Animal a ON ta.animal_id = a.animal_id
        LEFT JOIN Zone z ON a.zone_id = z.zone_id";

// Add status filter if provided and status column exists
if ($statusFilter && $hasStatusColumn) {
    $sql .= " WHERE COALESCE(ta.status, 'active') = ?";
    $sql .= " ORDER BY ta.alert_id DESC";
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        $error = mysqli_error($conn);
        send_json(["success" => false, "error" => "SQL Prepare Error: " . $error . " | SQL: " . $sql], 500);
    }
    mysqli_stmt_bind_param($stmt, "s", $statusFilter);
    if (!mysqli_stmt_execute($stmt)) {
        $error = mysqli_stmt_error($stmt);
        mysqli_stmt_close($stmt);
        send_json(["success" => false, "error" => "SQL Execute Error: " . $error], 500);
    }
    $result = mysqli_stmt_get_result($stmt);
    if (!$result) {
        $error = mysqli_error($conn);
        mysqli_stmt_close($stmt);
        send_json(["success" => false, "error" => "SQL Get Result Error: " . $error], 500);
    }
} else {
    $sql .= " ORDER BY ta.alert_id DESC";
    $result = mysqli_query($conn, $sql);
    if (!$result) {
        $error = mysqli_error($conn);
        send_json(["success" => false, "error" => "SQL Query Error: " . $error . " | SQL: " . $sql], 500);
    }
}

$threats = [];
while ($row = mysqli_fetch_assoc($result)) {
    $threats[] = $row;
}

if (isset($stmt)) {
    mysqli_stmt_close($stmt);
}

send_json(["success" => true, "data" => $threats]);
?>

