<?php
$DB_HOST = '127.0.0.1';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'wildtrack_db';

// Create connection
$mysqli = mysqli_connect($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
$conn = $mysqli; // Alias for compatibility

// Check connection
if (!$mysqli) {
    // Connection failed - let calling script handle error
    $db_connection_error = mysqli_connect_error();
}

// Set UTF-8 if connection successful
if ($mysqli) {
    mysqli_set_charset($mysqli, 'utf8mb4');
}
