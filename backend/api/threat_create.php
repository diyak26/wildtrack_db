<?php
// Start output buffering to catch any unexpected output
ob_start();

// Set error handling first
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Clear any output that might have been generated
ob_clean();

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

try {
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

    // Validate that animal_id exists in Animal table
    $animalCheck = mysqli_query($mysqli, "SELECT animal_id FROM Animal WHERE animal_id = " . intval($data["animal_id"]));
    if (!$animalCheck || mysqli_num_rows($animalCheck) == 0) {
        send_json(["success" => false, "error" => "Animal with ID " . $data["animal_id"] . " does not exist"], 400);
    }

    // Check table name (case-insensitive)
    $tableCheck = mysqli_query($mysqli, "SHOW TABLES LIKE 'threat_alert'");
    if (!$tableCheck) {
        send_json(["success" => false, "error" => "Error checking tables: " . mysqli_error($mysqli)], 500);
    }

    if (mysqli_num_rows($tableCheck) == 0) {
        $tableCheck = mysqli_query($mysqli, "SHOW TABLES LIKE 'Threat_Alert'");
        if (!$tableCheck) {
            send_json(["success" => false, "error" => "Error checking tables: " . mysqli_error($mysqli)], 500);
        }
        if (mysqli_num_rows($tableCheck) == 0) {
            send_json(["success" => false, "error" => "Threat_Alert table does not exist"], 500);
        }
        $tableName = "Threat_Alert";
    } else {
        $tableName = "threat_alert";
    }

    // Check which columns exist
    $checkStatus = mysqli_query($mysqli, "SHOW COLUMNS FROM `$tableName` LIKE 'status'");
    if (!$checkStatus) {
        send_json(["success" => false, "error" => "Error checking columns: " . mysqli_error($mysqli)], 500);
    }
    $hasStatusColumn = mysqli_num_rows($checkStatus) > 0;

    $reported_date = $data["reported_date"] ?? date("Y-m-d");

    // Build INSERT statement - don't include action column
    // Note: 'type' is a reserved keyword, so we use backticks
    if ($hasStatusColumn) {
        $sql = "INSERT INTO `$tableName` 
                (animal_id, `type`, severity, reported_date, status) 
                VALUES (?, ?, ?, ?, ?)";
    } else {
        $sql = "INSERT INTO `$tableName` 
                (animal_id, `type`, severity, reported_date) 
                VALUES (?, ?, ?, ?)";
    }

    $stmt = mysqli_prepare($mysqli, $sql);
    if (!$stmt) {
        send_json(["success" => false, "error" => "Database error: " . mysqli_error($mysqli) . " | SQL: " . $sql], 500);
    }

    // Prepare variables for binding (must be variables, not expressions)
    $animal_id = intval($data["animal_id"]);
    $type = $data["type"] ?? null;
    $severity = $data["severity"] ?? null;
    
    if ($hasStatusColumn) {
        $status = $data["status"] ?? "active";
        mysqli_stmt_bind_param(
            $stmt,
            "issss",
            $animal_id,
            $type,
            $severity,
            $reported_date,
            $status
        );
    } else {
        mysqli_stmt_bind_param(
            $stmt,
            "isss",
            $animal_id,
            $type,
            $severity,
            $reported_date
        );
    }

    $ok = mysqli_stmt_execute($stmt);

    if (!$ok) {
        $error = mysqli_error($mysqli);
        $stmtError = mysqli_stmt_error($stmt);
        mysqli_stmt_close($stmt);
        send_json([
            "success" => false, 
            "error" => "Database error: " . ($stmtError ?: $error),
            "sql" => $sql,
            "data" => $data
        ], 500);
    }

    mysqli_stmt_close($stmt);
    send_json(["success" => true, "message" => "Threat alert created successfully"]);

} catch (Exception $e) {
    ob_clean();
    send_json([
        "success" => false,
        "error" => "Unexpected error: " . $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ], 500);
} catch (Error $e) {
    ob_clean();
    send_json([
        "success" => false,
        "error" => "Fatal error: " . $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ], 500);
}

// End output buffering
ob_end_flush();
?>

