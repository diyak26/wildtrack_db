<?php
require_once "../config/db.php";
require_once "../helpers/response.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data["zone_id"]) ||
    empty($data["zone_name"]) ||
    empty($data["description"]) ||
    empty($data["area"])
) {
    send_json(["success" => false, "error" => "zone_id, zone_name, description, and area are required"]);
}

$sql = "UPDATE Zone 
        SET zone_name=?, description=?, area=?
        WHERE zone_id=?";

$stmt = mysqli_prepare($mysqli, $sql);
mysqli_stmt_bind_param(
    $stmt,
    "sssi",
    $data["zone_name"],
    $data["description"],
    $data["area"],
    $data["zone_id"]
);

$ok = mysqli_stmt_execute($stmt);

if (!$ok) {
    send_json(["success" => false, "error" => mysqli_error($mysqli)]);
}

send_json(["success" => true, "message" => "Zone updated successfully"]);
?>
