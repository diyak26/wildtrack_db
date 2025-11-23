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

$animal_id = intval($data['animal_id'] ?? 0);
$gps_location = trim($data['gps_location'] ?? "");
$movement_pattern = trim($data['movement_pattern'] ?? "");
$time_stamp_input = trim($data['time_stamp'] ?? "");

if ($animal_id <= 0 || empty($gps_location)) {
    send_json(["status" => "error", "message" => "Animal ID and GPS location are required"], 400);
}

// Check if animal exists
$check = mysqli_query($mysqli, "SELECT animal_id FROM Animal WHERE animal_id = $animal_id");
if (!$check || mysqli_num_rows($check) == 0) {
    send_json(["status" => "error", "message" => "Animal with ID $animal_id does not exist"], 400);
}

// Format timestamp
if ($time_stamp_input) {
    $time_stamp = str_replace("T", " ", $time_stamp_input);
    if (strlen($time_stamp) === 16) $time_stamp .= ":00";
} else {
    $time_stamp = date("Y-m-d H:i:s");
}

$sql = "INSERT INTO tracking_record (animal_id, gps_location, movement_pattern, time_stamp)
        VALUES (?, ?, ?, ?)";

$stmt = mysqli_prepare($mysqli, $sql);
if (!$stmt) {
    send_json(["status" => "error", "message" => "Database error: " . mysqli_error($mysqli)], 500);
}

mysqli_stmt_bind_param($stmt, "isss", $animal_id, $gps_location, $movement_pattern, $time_stamp);

if (!mysqli_stmt_execute($stmt)) {
    mysqli_stmt_close($stmt);
    send_json(["status" => "error", "message" => "Database error: " . mysqli_error($mysqli)], 500);
}

mysqli_stmt_close($stmt);
send_json(["status" => "success", "message" => "GPS record added"]);
?>
