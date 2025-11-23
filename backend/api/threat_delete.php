<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
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

// Get alert_id from URL
$id = $_GET["alert_id"] ?? 0;

// Validate that alert_id is provided and is a valid number
if (empty($id) || !is_numeric($id)) {
    send_json(["success" => false, "error" => "Invalid alert_id"], 400);
}

// Delete the threat alert from database
$sql = "DELETE FROM Threat_Alert WHERE alert_id=?";
$stmt = mysqli_prepare($mysqli, $sql);
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);

// Check if deletion was successful
$affected_rows = mysqli_stmt_affected_rows($stmt);
mysqli_stmt_close($stmt);

if ($affected_rows == 0) {
    send_json(["success" => false, "error" => "Threat alert not found"], 404);
}

send_json(["success" => true, "message" => "Threat alert deleted successfully"]);
?>

