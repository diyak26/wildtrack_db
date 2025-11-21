<?php
require_once "../config/db.php";
require_once "../helpers/response.php";

// read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// required validation
if (
    empty($data["zone_id"]) ||
    empty($data["zone_name"]) ||
    empty($data["description"]) ||
    empty($data["area"])
) {
    send_json(["success" => false, "error" => "zone_id, zone_name, description, and area are required"]);
}

$sql = "INSERT INTO Zone (zone_id, zone_name, description, area)
        VALUES (?, ?, ?, ?)";

$stmt = mysqli_prepare($mysqli, $sql);
mysqli_stmt_bind_param(
    $stmt,
    "isss",
    $data["zone_id"],
    $data["zone_name"],
    $data["description"],
    $data["area"]
);

$ok = mysqli_stmt_execute($stmt);

if (!$ok) {
    send_json(["success" => false, "error" => mysqli_error($mysqli)]);
}

send_json(["success" => true, "message" => "Zone added successfully"]);
?>
