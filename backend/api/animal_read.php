<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

$sql = "SELECT a.*, z.zone_name
        FROM Animal a
        LEFT JOIN Zone z ON a.zone_id = z.zone_id
        ORDER BY a.animal_id DESC";

$result = mysqli_query($mysqli, $sql);

$animals = [];
while ($row = mysqli_fetch_assoc($result)) {
    $animals[] = $row;
}

send_json([
    "success" => true,
    "data" => $animals
]);
?>
