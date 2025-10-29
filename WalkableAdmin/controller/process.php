<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Start session at the very top, before any output
session_start();

// db_admin.php is one level up
require_once '../db_admin.php';


$action = $_REQUEST['action'] ?? '';

switch($action) {
    case 'loginUser':
        loginUser($conn, $_POST);
        break;
    case 'logoutUser':
        logoutUser();
        break;
    case 'addUser':
        addUser($conn, $_POST);
        break;
    case 'updateUser':
        updateUser($conn, $_POST);
        break;
    case 'deleteUser':
        deleteUser($conn, $_GET);
        break;
    default:
        // Default redirect to login page
        header("Location: ../index.php");
        exit;
}

function loginUser($conn, $data) {
    if (empty($data['email']) || empty($data['password'])) {
        header("Location: ../index.php?msg=login_failed");
        exit;
    }

    // --- SPECIAL HARDCODED ADMIN LOGIN ---
    // This allows login with admin@email.com and admin123
    // Temporary lang ni anay
    if ($data['email'] === 'admin@email.com' && $data['password'] === 'admin123') {
        // Manually log in the user
        session_regenerate_id(true); 
        $_SESSION['user_id'] = '1';
        $_SESSION['user_name'] = 'Admin';
        $_SESSION['user_email'] = 'admin@email.com';

        // Redirect to the secured dashboard
        header("Location: ../dashboard.php");
        exit;
    }
    // --- END SPECIAL LOGIN ---

    try {
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // --- SECURE LOGIN ---
        // Verify user exists AND the password matches the hash in the database
        if ($user && password_verify($data['password'], $user['password'])) {
            
            // Password is correct! Store user data in session
            session_regenerate_id(true);
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];

            // Redirect to the secured dashboard
            header("Location: ../dashboard.php");
            exit;

        } else {
            // Invalid email or password
            header("Location: ../index.php?msg=login_failed");
            exit;
        }
    } catch(PDOException $e) {
        header("Location: ../index.php?msg=error");
        exit;
    }
}

function logoutUser() {
    // Unset all session variables
    $_SESSION = array();

    // Destroy the session cookie
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // Destroy the session
    session_destroy();

    // Redirect to login page with a logged-out message
    header("Location: ../index.php?msg=logged_out");
    exit;
}


function addUser($conn, $data) {
    try {
        // --- SECURE HASHING ---
        $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
        
        $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$data['name'], $data['email'], $hashed_password]);

    } catch(PDOException $e) {
        // Handle duplicate email
        if ($e->errorInfo[1] == 1062) {
            header("Location: ../dashboard.php?msg=email_exists");
            exit;
        }
        // Log this error: error_log("Error creating user: " . $e->getMessage());
        header("Location: ../dashboard.php?msg=error");
        exit;
    }

    // REDIRECT FIX: Point to dashboard.php
    header("Location: ../dashboard.php?msg=created");
    exit;
}


function updateUser($conn, $data) {
    try {
        if (!empty($data['password'])) {
            // User wants to update the password
            // --- SECURE HASHING ---
            $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
            
            $sql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$data['name'], $data['email'], $hashed_password, $data['id']]);

        } else {
            // User does not want to update password
            $sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$data['name'], $data['email'], $data['id']]);
        }

    } catch(PDOException $e) {
        // Handle duplicate email
        if ($e->errorInfo[1] == 1062) {
            header("Location: ../dashboard.php?msg=email_exists");
            exit;
        }
        header("Location: ../dashboard.php?msg=error");
        exit;
    }

    header("Location: ../dashboard.php?msg=updated");
    exit;
}


function deleteUser($conn, $data) {
    if (empty($data['id'])) {
        header("Location: ../dashboard.php?msg=error");
        exit;
    }

    try {
        $sql = "DELETE FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([ $data['id'] ]);

    } catch(PDOException $e) {
        header("Location: ../dashboard.php?msg=error");
        exit;
    }

    header("Location: ../dashboard.php?msg=deleted");
    exit;
}

?>

