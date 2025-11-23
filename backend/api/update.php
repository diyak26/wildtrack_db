<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

$input = json_decode(file_get_contents("php://input"), true);
if (!$input) error("Invalid JSON input");

$followup_id = intval($input['followup_id'] ?? 0);
if (!$followup_id) error("followup_id is required", 422);

$record_type = trim($input['record_type'] ?? '');
$animal_id = intval($input['animal_id'] ?? 0);
$treatment_date = trim($input['treatment_date'] ?? '');
$vet_name = trim($input['vet_name'] ?? '');
$diagnosis = trim($input['diagnosis'] ?? '');
$treatment = trim($input['treatment'] ?? '');
$medication = trim($input['medication'] ?? '');
$notes = trim($input['notes'] ?? '');

// Basic validation
if (!$record_type || !$animal_id || !$treatment_date) {
    error("record_type, animal_id and treatment_date are required", 422);
}

$sql = "
UPDATE Medical_Record SET
    record_type = ?,
    animal_id = ?,
    treatment_date = ?,
    vet_name = ?,
    diagnosis = ?,
    treatment = ?,
    medication = ?,
    notes = ?
WHERE followup_id = ?
";

$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) error("Prepare failed: " . mysqli_error($conn));

mysqli_stmt_bind_param($stmt, "sissssssi",
    $record_type,
    $animal_id,
    $treatment_date,
    $vet_name,
    $diagnosis,
    $treatment,
    $medication,
    $notes,
    $followup_id
);

if (mysqli_stmt_execute($stmt)) {
    success([], "Medical record updated successfully");
} else {
    error("Update failed: " . mysqli_stmt_error($stmt));
}
