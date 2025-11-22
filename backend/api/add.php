<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

$input = json_decode(file_get_contents("php://input"), true);
if (!$input) error("Invalid JSON input");

// Required fields
$record_id = trim($input['record_id'] ?? '');
$animal_id = intval($input['animal_id'] ?? 0);
$treatment_date = trim($input['treatment_date'] ?? ''); // expecting YYYY-MM-DD

// optional
$vet_name = trim($input['vet_name'] ?? '');
$diagnosis = trim($input['diagnosis'] ?? '');
$treatment = trim($input['treatment'] ?? '');
$medication = trim($input['medication'] ?? '');
$notes = trim($input['notes'] ?? '');

if (!$record_id || !$animal_id || !$treatment_date) {
    error("record_id, animal_id and treatment_date are required", 422);
}

$sql = "INSERT INTO Medical_Record 
    (record_id, animal_id, treatment_date, vet_name, diagnosis, treatment, medication, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) error("Prepare failed: " . mysqli_error($conn));

mysqli_stmt_bind_param($stmt, "sissssss",
    $record_id,
    $animal_id,
    $treatment_date,
    $vet_name,
    $diagnosis,
    $treatment,
    $medication,
    $notes
);

if (mysqli_stmt_execute($stmt)) {
    $newId = mysqli_insert_id($conn);
    success(["followup_id" => $newId], "Medical record added", 201);
} else {
    error("Insert failed: " . mysqli_stmt_error($stmt));
}
