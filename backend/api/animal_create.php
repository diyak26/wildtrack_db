<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data["name"]) || empty($data["species"])) {
    echo json_encode(["status" => "error", "message" => "Name and Species are required"]);
    exit;
}

$sql = "INSERT INTO Animal (animal_id, name, species, age, gender, zone_id, health_status, conservation_status, entry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);

mysqli_stmt_bind_param($stmt, "issssssss", 
    $data["animal_id"], $data["name"], $data["species"], $data["age"], 
    $data["gender"], $data["zone_id"], $data["health_status"], 
    $data["conservation_status"], $data["entry_date"]
);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["status" => "success", "message" => "Animal created successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
}
?>
