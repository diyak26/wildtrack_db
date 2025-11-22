<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

// Return all medical records joined with animal species as animal_name
// Handle case where new columns might not exist yet
$sql = "
SELECT 
    m.followup_id,
    m.record_id,
    m.animal_id,
    COALESCE(a.species, '') AS animal_name,
    m.treatment_date,
    m.vet_name,
    COALESCE(m.diagnosis, '') AS diagnosis,
    COALESCE(m.treatment, '') AS treatment,
    COALESCE(m.medication, '') AS medication,
    COALESCE(m.notes, '') AS notes
FROM Medical_Record m
LEFT JOIN Animal a ON m.animal_id = a.animal_id
ORDER BY m.treatment_date DESC
";

$result = mysqli_query($conn, $sql);
if (!$result) {
    $error = mysqli_error($conn);
    // If columns don't exist, try without them
    if (strpos($error, "Unknown column") !== false) {
        $sql = "
        SELECT 
            m.followup_id,
            m.record_id,
            m.animal_id,
            COALESCE(a.species, '') AS animal_name,
            m.treatment_date,
            m.vet_name,
            '' AS diagnosis,
            '' AS treatment,
            '' AS medication,
            '' AS notes
        FROM Medical_Record m
        LEFT JOIN Animal a ON m.animal_id = a.animal_id
        ORDER BY m.treatment_date DESC
        ";
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            error("SQL Error: " . mysqli_error($conn));
        }
    } else {
        error("SQL Error: " . $error);
    }
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

success($data, "Medical records loaded");
