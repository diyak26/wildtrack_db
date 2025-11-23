<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';

if (!isset($mysqli) || !$mysqli) {
    send_json(["status" => "error", "message" => "Database connection failed"], 500);
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    send_json(["status" => "error", "message" => "Invalid JSON data"], 400);
}

$tracking_id = intval($data["tracking_id"] ?? 0);
$gps_location = trim($data["gps_location"] ?? "");
$movement_pattern = trim($data["movement_pattern"] ?? "");
$time_stamp = trim($data["time_stamp"] ?? "");

if (!$tracking_id || empty($gps_location)) {
    send_json(["status" => "error", "message" => "Tracking ID and GPS location are required"], 400);
}

// Format timestamp
if (empty($time_stamp)) {
    $time_stamp = date("Y-m-d H:i:s");
} else {
    $time_stamp = str_replace("T", " ", $time_stamp);
    if (strlen($time_stamp) === 16) $time_stamp .= ":00";
}

$sql = "UPDATE tracking_record 
        SET gps_location = ?, movement_pattern = ?, time_stamp = ?
        WHERE tracking_id = ?";

$stmt = mysqli_prepare($mysqli, $sql);
if (!$stmt) {
    send_json(["status" => "error", "message" => "Database error: " . mysqli_error($mysqli)], 500);
}

mysqli_stmt_bind_param($stmt, "sssi", $gps_location, $movement_pattern, $time_stamp, $tracking_id);

if (!mysqli_stmt_execute($stmt)) {
    mysqli_stmt_close($stmt);
    send_json(["status" => "error", "message" => "Database error: " . mysqli_error($mysqli)], 500);
}

mysqli_stmt_close($stmt);
send_json(["status" => "success", "message" => "GPS record updated"]);
?>
