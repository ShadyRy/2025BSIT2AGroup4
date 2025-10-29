<?php
require 'db_config.php';

$name = $_POST['name'] ?? null;
$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;
$confirm_password = $_POST['confirm_password'] ?? null;

if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all fields.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit;
}
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit;
}
if ($password !== $confirm_password) {
    echo json_encode(['success' => false, 'message' => 'Passwords do not match.']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'This email is already registered.']);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$name, $email, $hashedPassword]);

    echo json_encode(['success' => true, 'message' => 'Signup successful! You can now log in.']);

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
$conn = null;
?>