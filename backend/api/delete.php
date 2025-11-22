<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

$input = json_decode(file_get_contents("php://input"), true);
if (!$input) error("Invalid JSON input");

// Accept either { "followup_id": 3 } or { "followup_ids": [3,4,5] }
if (isset($input['followup_id']) && $input['followup_id']) {
    $id = intval($input['followup_id']);
    $stmt = mysqli_prepare($conn, "DELETE FROM Medical_Record WHERE followup_id = ?");
    if (!$stmt) error("Prepare failed: " . mysqli_error($conn));
    mysqli_stmt_bind_param($stmt, "i", $id);
    if (mysqli_stmt_execute($stmt)) success([], "Record deleted");
    else error("Deletion failed: " . mysqli_stmt_error($stmt));
    exit;
}

if (isset($input['followup_ids']) && is_array($input['followup_ids']) && count($input['followup_ids'])>0) {
    $ids = array_map('intval', $input['followup_ids']);
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $types = str_repeat('i', count($ids));
    $sql = "DELETE FROM Medical_Record WHERE followup_id IN ($placeholders)";
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) error("Prepare failed: " . mysqli_error($conn));

    // bind params dynamically
    $refs = [];
    $refs[] = & $types;
    foreach ($ids as $k => $v) {
        $refs[] = & $ids[$k];
    }
    call_user_func_array('mysqli_stmt_bind_param', array_merge([$stmt], $refs));

    if (mysqli_stmt_execute($stmt)) success([], "Deleted " . mysqli_stmt_affected_rows($stmt) . " record(s)");
    else error("Bulk delete failed: " . mysqli_stmt_error($stmt));
    exit;
}

error("No followup_id or followup_ids provided", 422);
