<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data["action_id"])) {
    send_json(["success" => false, "error" => "action_id is required"]);
}

$sql = "UPDATE Conservation_Action SET 
        title=?, 
        status=?, 
        start_date=?, 
        team=?, 
        description=?
        WHERE action_id=?";

$stmt = mysqli_prepare($mysqli, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "sssssi",
    $data["title"],
    $data["status"],
    $data["start_date"],
    $data["team"],
    $data["description"],
    $data["action_id"]
);

$ok = mysqli_stmt_execute($stmt);

if (!$ok) {
    send_json(["success" => false, "error" => mysqli_error($mysqli)]);
}

send_json(["success" => true, "message" => "Conservation action updated successfully"]);
?>

