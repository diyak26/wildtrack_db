<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

// Check database connection
if (!isset($mysqli) || !$mysqli) {
    send_json(["success" => false, "error" => "Database connection failed"], 500);
}

$sql = "SELECT a.*, z.zone_name
        FROM Animal a
        LEFT JOIN Zone z ON a.zone_id = z.zone_id
        ORDER BY a.animal_id DESC";

$result = mysqli_query($conn, $sql);

if (!$result) {
    send_json(["success" => false, "error" => "SQL Error: " . mysqli_error($conn)], 500);
}

$animals = [];
while ($row = mysqli_fetch_assoc($result)) {
    $animals[] = $row;
}

success($animals);
?>
