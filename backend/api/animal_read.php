<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

$sql = "SELECT a.*, z.zone_name
        FROM Animal a
        LEFT JOIN Zone z ON a.zone_id = z.zone_id
        ORDER BY a.animal_id DESC";

$result = mysqli_query($conn, $sql);

if (!$result) {
    error("SQL Error: " . mysqli_error($conn));
}

$animals = [];
while ($row = mysqli_fetch_assoc($result)) {
    $animals[] = $row;
}

success($animals, "Animals loaded");
?>
