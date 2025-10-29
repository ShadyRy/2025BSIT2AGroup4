<?php
// Start session and include database
session_start();

// --- SECURE PAGE ---
// Check if the user is logged in. If not, redirect to the login page.
if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
    header("Location: index.php?msg=denied");
    exit;
}

require_once 'db_admin.php';

try {
    // We fetch all users from the 'users' table to display in our table
    $stmt = $conn->query("SELECT * FROM users ORDER BY id DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Error fetching users: " . $e->getMessage());
}

// --- Check for "Edit" mode ---
$edit_user = null;
$is_edit_mode = false; // By default, we are in "Add" mode

// If the URL has ?action=edit&id=1, we fetch that user
if (isset($_GET['action']) && $_GET['action'] == 'edit' && isset($_GET['id'])) {
    $edit_id = $_GET['id'];
    try {
        $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$edit_id]);
        $edit_user = $stmt->fetch(PDO::FETCH_ASSOC);

        // If we found a user, switch to "Edit" mode
        if ($edit_user) {
            $is_edit_mode = true;
        }
    } catch(PDOException $e) {
        $edit_user = null; // User not found or error
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Walkables Admin</title>
    <link rel="stylesheet" href="assets/styles.css">
</head>
<body>

    <div id="toast-container" class="toast-js-container"></div>

    <div class="container">
        
        <div class="header-nav">
            <h1>Walkables Admin Panel</h1>
            <div class="header-links">
                <span>Welcome, <?php echo htmlspecialchars($_SESSION['user_name'] ?? 'Admin'); ?>!</span>
                <a href="controller/process.php?action=logoutUser" class="btn btn-secondary btn-small">Logout</a>
            </div>
        </div>
        
        <p>Manage the users in your database.</p>


        <!-- ADD NEW USER FORM -->
        <?php if (!$is_edit_mode): ?>
        <div class="form-card">
            <h2>Add New User</h2>
            <form action="controller/process.php" method="POST">
                <input type="hidden" name="action" value="addUser">
                
                <div class="form-grid">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 1rem;">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Set new password" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Add User</button>
                </div>
            </form>
        </div>
        <?php endif; ?>

        <!-- UPDATE USER FORM -->
        <?php if ($is_edit_mode && $edit_user): ?>
        <div class="form-card">
            <h2>Update User (ID: <?php echo htmlspecialchars($edit_user['id']); ?>)</h2>
            <form action="controller/process.php" method="POST">
                <input type="hidden" name="action" value="updateUser">
                <input type="hidden" name="id" value="<?php echo $edit_user['id']; ?>">

                <div class="form-grid">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" 
                            value="<?php echo htmlspecialchars($edit_user['name']); ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" 
                            value="<?php echo htmlspecialchars($edit_user['email']); ?>" required>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 1rem;">
                    <label for="password">New Password</label>
                    <input type="password" id="password" name="password" 
                        placeholder="Leave blank to keep same password">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <!-- Link to cancel and go back to the main dashboard page -->
                    <a href="dashboard.php" class="btn btn-secondary">Cancel Edit</a>
                </div>
            </form>
        </div>
        <?php endif; ?>


        <!-- USERS TABLE -->
        <h2>All Users (<?php echo count($users); ?>)</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Created On</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($users)): ?>
                    <tr>
                        <td colspan="5" style="text-align: center;">No users found.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($users as $user): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($user['id']); ?></td>
                            <td><?php echo htmlspecialchars($user['name']); ?></td>
                            <td><?php echo htmlspecialchars($user['email']); ?></td>
                            <td><?php echo date('M d, Y', strtotime($user['created_at'])); ?></td>
                            <td class="action-links">
                                <!-- Edit Link -->
                                <a href="dashboard.php?action=edit&id=<?php echo $user['id']; ?>" class="edit-link">Edit</a>
                                
                                <!-- 
                                    Delete link points to the 'controller' sub-folder
                                -->
                                <a href="controller/process.php?action=deleteUser&id=<?php echo $user['id']; ?>" 
                                    class="delete-link" 
                                    onclick="return confirm('Are you sure you want to delete this user?');">Delete</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <script src="assets/script.js"></script>
</body>
</html>
