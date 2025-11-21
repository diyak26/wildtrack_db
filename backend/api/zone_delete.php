<?php
require_once "../config/db.php";
require_once "../helpers/response.php";

$id = $_GET["zone_id"] ?? 0;

$sql = "DELETE FROM Zone WHERE zone_id=?";
$stmt = mysqli_prepare($mysqli, $sql);
mysqli_stmt_bind_param($stmt, "i", $id);

$ok = mysqli_stmt_execute($stmt);

if (!$ok) {
    send_json(["success" => false, "error" => mysqli_error($mysqli)]);
}

send_json(["success" => true, "message" => "Zone deleted"]);
?>
