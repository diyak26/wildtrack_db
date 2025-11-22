<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

$sql = "SELECT * FROM Conservation_Action ORDER BY action_id DESC";

$result = mysqli_query($mysqli, $sql);

$actions = [];
while ($row = mysqli_fetch_assoc($result)) {
    $actions[] = $row;
}

send_json([
    "success" => true,
    "data" => $actions
]);
?>

