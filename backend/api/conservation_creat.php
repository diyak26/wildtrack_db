<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

$data = json_decode(file_get_contents("php://input"), true);

$sql = "INSERT INTO Conservation_Action 
        (action_id, title, status, start_date, team, description) 
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = mysqli_prepare($mysqli, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "isssss",
    $data["action_id"],
    $data["title"],
    $data["status"],
    $data["start_date"],
    $data["team"],
    $data["description"]
);

$ok = mysqli_stmt_execute($stmt);

if (!$ok) {
    send_json(["success" => false, "error" => mysqli_error($mysqli)]);
}

send_json(["success" => true, "message" => "Conservation action created successfully"]);
?>

