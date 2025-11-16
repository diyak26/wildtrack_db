<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

$id = $_GET["animal_id"] ?? 0;

$sql = "DELETE FROM Animal WHERE animal_id=?";
$stmt = mysqli_prepare($mysqli, $sql);
mysqli_stmt_bind_param($stmt, "i", $id);

$ok = mysqli_stmt_execute($stmt);

if (!$ok) {
    send_json(["success" => false, "error" => mysqli_error($mysqli)]);
}

send_json(["success" => true, "message" => "Animal deleted successfully"]);
?>

