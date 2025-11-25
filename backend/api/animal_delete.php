<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';

$id = $_GET["animal_id"] ?? 0;

if (empty($id) || !is_numeric($id)) {
    echo json_encode(["status" => "error", "message" => "Invalid animal_id"]);
    exit;
}

$sql = "DELETE FROM Animal WHERE animal_id=?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);

if (mysqli_stmt_affected_rows($stmt) > 0) {
    echo json_encode(["status" => "success", "message" => "Animal deleted successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Animal not found"]);
}
?>
