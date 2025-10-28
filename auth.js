// =====================================================================
// Authentication, Modals, and Menus
// =====================================================================

/**
 * Checks with the server if a user session exists.
 * Assumes 'currentUser' is a global variable (from main.js).
 */
async function checkUserSession() {
    try {
        const response = await fetch('api/check_session.php');
        const data = await response.json();
        if (data.isLoggedIn) {
            currentUser = data.user;
        } else {
            currentUser = null;
        }
    } catch (error) {
        console.error('Error checking session:', error);
        currentUser = null;
    }
}

/**
 * Opens a modal by its ID.
 * @param {string} modalId The ID of the modal element to open.
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        requestAnimationFrame(() => modal.classList.add('show'));

        const firstInput = modal.querySelector('input:not([type="hidden"])');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
}

/**
 * Closes a modal by its ID.
 * @param {string} modalId The ID of the modal element to close.
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => (modal.style.display = 'none'), 250);

        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

/**
 * Toggles the user dropdown menu.
 * Assumes 'userMenuOpen' is a global variable (from main.js).
 */
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenuOpen = !userMenuOpen;
        userMenu.classList.toggle('show', userMenuOpen);
    }
}

/**
 * Closes the user dropdown menu.
 * Assumes 'userMenuOpen' is a global variable (from main.js).
 */
function closeUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) userMenu.classList.remove('show');
    userMenuOpen = false;
}

/**
 * Toggles the mobile navigation menu.
 * Assumes 'mobileMenuOpen' is a global variable (from main.js).
 */
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenuOpen = !mobileMenuOpen;
        mobileMenu.classList.toggle('show', mobileMenuOpen);
    }
}

/**
 * Closes the mobile navigation menu.
 * Assumes 'mobileMenuOpen' is a global variable (from main.js).
 */
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) mobileMenu.classList.remove('show');
    mobileMenuOpen = false;
}

/**
 * Handles the login form submission.
 * @param {Event} e The form submission event.
 */
async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();

    if (!email || !password) return showToast('Email and password are required.', 'error');

    try {
        const response = await fetch('api/login_handler.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            currentUser = result.user; // Set global user
            closeModal('loginModal');
            form.reset();
            updateUI(); // Update navbar
            showToast(result.message, 'success');
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('An error occurred during login.', 'error');
    }
}

/**
 * Handles the signup form submission.
 * @param {Event} e The form submission event.
 */
async function handleSignup(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Client-side validation
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();
    const confirmPassword = formData.get('confirm_password').trim();

    // Use isValidEmail from utils.js
    if (!name || !email || !password || !confirmPassword) return showToast('All fields are required.', 'error');
    if (name.length < 2) return showToast('Name must be at least 2 characters.', 'error');
    if (typeof isValidEmail === 'function' && !isValidEmail(email)) return showToast('Please enter a valid email.', 'error');
    if (password.length < 6) return showToast('Password must be at least 6 characters.', 'error');
    if (password !== confirmPassword) return showToast('Passwords do not match.', 'error');

    // Send to server
    try {
        const response = await fetch('api/signup_handler.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            closeModal('signupModal');
            form.reset();
            showToast(result.message, 'success');
            openModal('loginModal'); // Open login modal
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showToast('An error occurred during signup.', 'error');
    }
}

/**
 * Handles user logout.
 */
async function handleLogout() {
    try {
        await fetch('api/logout_handler.php');
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    currentUser = null;
    // Navigate to home page after logout
    if (window.location.pathname.endsWith('index.php') || window.location.pathname.endsWith('/')) {
        updateUI(); // Just update UI if on home page
    } else {
        window.location.href = 'index.php'; // Redirect to home if on another page
    }
    closeUserMenu();
    showToast('Successfully logged out!', 'success');
}

/**
 * Gets the initials from a user's name.
 * @param {string} name The user's full name.
 * @returns {string} A 1-2 character string of initials.
 */
function getUserInitials(name) {
    if (!name) return '??';
    return name.trim().split(' ').map(w => w[0].toUpperCase()).join('').substring(0, 2);
}