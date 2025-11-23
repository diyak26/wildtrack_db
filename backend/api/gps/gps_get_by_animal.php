<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';

$animal_id = intval($_GET['animal_id'] ?? 0);

if (!$animal_id) {
    error("Animal ID required", 422);
}

$stmt = $conn->prepare("SELECT * FROM tracking_record WHERE animal_id=? ORDER BY time_stamp DESC");
$stmt->bind_param("i", $animal_id);
$stmt->execute();

$result = $stmt->get_result();
$records = [];

while ($row = $result->fetch_assoc()) {
    $records[] = $row;
}

success($records);
?>
