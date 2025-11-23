<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

// Check database connection
if (!isset($mysqli) || !$mysqli) {
    send_json(["success" => false, "error" => "Database connection failed"], 500);
}

// Get status filter from query parameter (optional)
$statusFilter = $_GET["status"] ?? null;

$sql = "SELECT ta.alert_id, ta.animal_id, a.name AS animal_name, a.species, 
               ta.type AS threat_type, ta.severity, ta.reported_date, 
               COALESCE(ta.status, 'active') AS status,
               a.zone_id, z.zone_name
        FROM threat_alert ta
        LEFT JOIN Animal a ON ta.animal_id = a.animal_id
        LEFT JOIN Zone z ON a.zone_id = z.zone_id";

// Add status filter if provided
if ($statusFilter) {
    $sql .= " WHERE COALESCE(ta.status, 'active') = ?";
    $sql .= " ORDER BY ta.alert_id DESC";
    $stmt = mysqli_prepare($mysqli, $sql);
    if (!$stmt) {
        send_json(["success" => false, "error" => "Database error: " . mysqli_error($mysqli)], 500);
    }
    mysqli_stmt_bind_param($stmt, "s", $statusFilter);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    mysqli_stmt_close($stmt);
} else {
    $sql .= " ORDER BY ta.alert_id DESC";
    $result = mysqli_query($mysqli, $sql);
    if (!$result) {
        send_json(["success" => false, "error" => "Database error: " . mysqli_error($mysqli)], 500);
    }
}

$threats = [];
while ($row = mysqli_fetch_assoc($result)) {
    $threats[] = $row;
}

send_json(["success" => true, "data" => $threats]);
?>
