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

$sql = "SELECT t.tracking_id, t.animal_id, a.name AS animal_name, 
               t.gps_location, t.time_stamp, t.movement_pattern
        FROM tracking_record t
        LEFT JOIN Animal a ON t.animal_id = a.animal_id
        ORDER BY t.tracking_id DESC";

$result = mysqli_query($mysqli, $sql);

if (!$result) {
    send_json(["status" => "error", "message" => "Database error: " . mysqli_error($mysqli)], 500);
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

send_json(["status" => "success", "data" => $data]);
?>
