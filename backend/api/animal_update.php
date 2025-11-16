<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data["animal_id"])) {
    send_json(["success" => false, "error" => "animal_id is required"]);
}

$sql = "UPDATE Animal SET 
        name=?, 
        species=?, 
        age=?, 
        gender=?, 
        zone_id=?, 
        health_status=?, 
        conservation_status=?, 
        entry_date=?
        WHERE animal_id=?";

$stmt = mysqli_prepare($mysqli, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "ssisisssi",
    $data["name"],
    $data["species"],
    $data["age"],
    $data["gender"],
    $data["zone_id"],
    $data["health_status"],
    $data["conservation_status"],
    $data["entry_date"],
    $data["animal_id"]
);

$ok = mysqli_stmt_execute($stmt);

if (!$ok) {
    send_json(["success" => false, "error" => mysqli_error($mysqli)]);
}

send_json(["success" => true, "message" => "Animal updated successfully"]);
?>
