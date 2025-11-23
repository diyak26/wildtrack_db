<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

// Check database connection
if (!isset($mysqli) || !$mysqli) {
    send_json(["success" => false, "error" => "Database connection failed"], 500);
}

$data = json_decode(file_get_contents("php://input"), true);

// Check if JSON decode failed
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    send_json(["success" => false, "error" => "Invalid JSON data"], 400);
}

// Validate required fields
if (empty($data["animal_id"]) || empty($data["name"]) || empty($data["species"])) {
    send_json(["success" => false, "error" => "animal_id, name, and species are required"], 400);
}

$sql = "INSERT INTO Animal 
        (animal_id, name, species, age, gender, zone_id, health_status, 
         conservation_status, entry_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = mysqli_prepare($mysqli, $sql);
if (!$stmt) {
    send_json(["success" => false, "error" => "Database error: " . mysqli_error($mysqli)], 500);
}

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
    $error = mysqli_error($mysqli);
    mysqli_stmt_close($stmt);
    send_json(["success" => false, "error" => "Database error: " . $error], 500);
}

mysqli_stmt_close($stmt);
send_json(["success" => true, "message" => "Animal created successfully"]);
?>
