<?php
require_once "../config/db.php";
require_once "../helpers/response.php";

$sql = "SELECT 
            z.zone_id,
            z.zone_name,
            z.description,
            z.area,
            COALESCE(a.cnt, 0) AS animals_cnt,
            z.created_at
        FROM Zone z
        LEFT JOIN (
            SELECT zone_id, COUNT(*) AS cnt
            FROM Animal
            WHERE zone_id IS NOT NULL
            GROUP BY zone_id
        ) a ON z.zone_id = a.zone_id
        ORDER BY z.zone_id ASC";
$result = mysqli_query($mysqli, $sql);

$zones = [];
while ($row = mysqli_fetch_assoc($result)) {
    $zones[] = $row;
}

send_json(["success" => true, "data" => $zones]);
?>
