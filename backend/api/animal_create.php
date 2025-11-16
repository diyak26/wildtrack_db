<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

$data = json_decode(file_get_contents("php://input"), true);



$sql = "INSERT INTO Animal 
        (animal_id, name, species, age, gender, zone_id, health_status, 
         conservation_status, entry_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = mysqli_prepare($mysqli, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "issssssss",
    $data["animal_id"],
    $data["name"],
    $data["species"],
    $data["age"],
    $data["gender"],
    $data["zone_id"],
    $data["health_status"],
    $data["conservation_status"],
    $data["entry_date"]
);

$ok = mysqli_stmt_execute($stmt);

if (!$ok) {
    send_json(["success" => false, "error" => mysqli_error($mysqli)]);
}

send_json(["success" => true, "message" => "Animal created successfully"]);
?>
