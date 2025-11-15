<?php
$host = "localhost";
$dbname = "wildtrack_db";
$username = "root"; 
$password = ""; // default empty for XAMPP

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<h2 style='color: green;'>✅ Connection Successful!</h2>";
} 

catch (PDOException $e) {
    echo "<h2 style='color: red;'>❌ Connection Failed: " . $e->getMessage() . "</h2>";
}
?>
