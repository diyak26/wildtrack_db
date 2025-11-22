<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

$animal_id = intval($_GET['animal_id'] ?? 0);

if (!$animal_id) {
    error("animal_id is required", 422);
}

$stmt = mysqli_prepare($conn, "SELECT * FROM Medical_Record WHERE animal_id=? ORDER BY treatment_date DESC");
mysqli_stmt_bind_param($stmt, "i", $animal_id);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);
$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

success($data, "Medical records fetched");
?>
