<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data["animal_id"])) {
    echo json_encode(["status" => "error", "message" => "Animal ID is required"]);
    exit;
}

$sql = "UPDATE Animal SET name=?, species=?, age=?, gender=?, zone_id=?, health_status=?, conservation_status=?, entry_date=? WHERE animal_id=?";
$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param($stmt, "ssisisssi", 
    $data["name"], $data["species"], $data["age"], $data["gender"], 
    $data["zone_id"], $data["health_status"], $data["conservation_status"], 
    $data["entry_date"], $data["animal_id"]
);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["status" => "success", "message" => "Animal updated successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
}
?>
