<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . '/../config/db.php';

$sql = "SELECT a.*, z.zone_name FROM Animal a LEFT JOIN Zone z ON a.zone_id = z.zone_id ORDER BY a.animal_id DESC";
$result = mysqli_query($conn, $sql);

$animals = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $animals[] = $row;
    }
}

echo json_encode(["status" => "success", "data" => $animals]);
?>
