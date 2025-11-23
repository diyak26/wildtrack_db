<?php
require_once __DIR__ . '/backend/config/db.php';

echo "Tables:\n";
$result = mysqli_query($conn, "SHOW TABLES");
while ($row = mysqli_fetch_row($result)) {
    echo $row[0] . "\n";
}

echo "\nDescribe Medical_Record:\n";
$result = mysqli_query($conn, "DESCRIBE Medical_Record");
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        echo $row['Field'] . " - " . $row['Type'] . "\n";
    }
} else {
    echo "Error: " . mysqli_error($conn) . "\n";
}

echo "\nTest List Query:\n";
$sql = "
SELECT 
    m.followup_id,
    m.record_type,
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
if ($result) {
    echo "Query Successful. Rows: " . mysqli_num_rows($result) . "\n";
} else {
    echo "Query Failed: " . mysqli_error($conn) . "\n";
}
