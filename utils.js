// =====================================================================
// Utils (Helpers)
// =====================================================================

/**
 * Displays a toast notification.
 * @param {string} message The message to display.
 * @param {'info' | 'success' | 'error'} type The type of toast.
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
    <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="close-btn">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

/**
 * Validates an email address.
 * @param {string} email The email to validate.
 * @returns {boolean} True if the email is valid.
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds.
 * @param {Function} func The function to debounce.
 * @param {number} wait The number of milliseconds to delay.
 * @returns {Function} The new debounced function.
 */
function debounce(func, wait) {
    let timeout;
    return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
    };
}
