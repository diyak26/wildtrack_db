<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

// Get animal_id from URL
$id = $_GET["animal_id"] ?? 0;

// Validate that animal_id is provided and is a valid number
if (empty($id) || !is_numeric($id)) {
    send_json(["success" => false, "error" => "Invalid animal_id"]);
}

// Delete the animal from database
$sql = "DELETE FROM Animal WHERE animal_id=?";
$stmt = mysqli_prepare($mysqli, $sql);
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);

// Check if deletion was successful
$affected_rows = mysqli_stmt_affected_rows($stmt);
mysqli_stmt_close($stmt);

if ($affected_rows == 0) {
    send_json(["success" => false, "error" => "Animal not found"]);
}

success([], "Animal deleted successfully");
?>

