<?php
$servername = "localhost";
$username   = "root";
$password   = ""; // Use an empty string for no password
$dbname     = "walkables";

header('Content-Type: application/json');

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Database Connection Error: ' . $e->getMessage()
    ]);
    exit;
}
?>