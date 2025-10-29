/**
 * Simple JavaScript Toast Notification System
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-js ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Trigger fade in
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Start fade out
    setTimeout(() => {
        toast.classList.remove('show');
        // Remove from DOM after fade out
        setTimeout(() => {
            if (toast.parentNode === container) {
                container.removeChild(toast);
            }
        }, 500);
    }, 3000);
}

/**
 * Toggles password visibility on the login page
 */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('toggle-password');
    
    // Only run if both elements exist on the page
    if (!passwordInput || !toggleButton) return;

    toggleButton.addEventListener('click', () => {
        // Check the type
        const isPassword = passwordInput.type === 'password';
        
        // Change the type and button text
        passwordInput.type = isPassword ? 'text' : 'password';
        toggleButton.textContent = isPassword ? 'Hide' : 'Show';
    });
}

// Check for messages in the URL query string
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');

    if (msg) {
        switch (msg) {
            // Login Page Messages
            case 'login_failed':
                showToast('Invalid email or password.', 'error');
                break;
            case 'logged_out':
                showToast('You have been logged out.', 'success');
                break;
            case 'denied':
                showToast('Please log in to access that page.', 'error');
                break;
            
            // Dashboard Page Messages
            case 'created':
                showToast('User created successfully!', 'success');
                break;
            case 'updated':
                showToast('User updated successfully!', 'success');
                break;
            case 'deleted':
                showToast('User deleted successfully.', 'success');
                break;
            case 'email_exists':
                showToast('That email address is already taken.', 'error');
                break;
            case 'error':
                showToast('An unexpected error occurred.', 'error');
                break;
        }
    }

    togglePasswordVisibility();
});
