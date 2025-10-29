<?php
// Start the session to check for login status or display errors
session_start();

// If the user is already logged in, redirect them to the dashboard
if (isset($_SESSION['user_id'])) {
    header("Location: dashboard.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Walkables Admin - Login</title>
    <link rel="stylesheet" href="assets/styles.css">

</head>
<body>

    <div id="toast-container" class="toast-js-container"></div>

    <div class="login-container">
        <div class="form-card login-card">
            <h2>Admin Login</h2>
            <p>Please sign in to continue.</p>
            
            <form id="login-form" action="controller/process.php" method="POST">
                <input type="hidden" name="action" value="loginUser">
                
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group" style="margin-top: 1rem;">
                    <label for="password">Password</label>
                    <div class="password-wrapper">
                        <input type="password" id="password" name="password" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" id="login-button" class="btn btn-primary" style="width: 100%;">Login</button>
                </div>
            </form>
        </div>
    </div>

    <script src="assets/script.js"></script>

</body>
</html>