// =====================================================================
// App Initialization and Main Controller
// =====================================================================

// ===== Global State =====
let currentUser = null;
let userMenuOpen = false;
let mobileMenuOpen = false;
let map; // Leaflet map instance

// =====================================================================
// App Initialization
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Run initializeApp which is now async
    initializeApp();
});

/**
 * Main app initialization function.
 * Now async to wait for user session check.
 */
async function initializeApp() {
    // Load user first by checking session
    if (typeof checkUserSession === 'function') {
        await checkUserSession(); // Await the session check
    }

    // Set up global event listeners
    setupEventListeners();
  
    // Update UI based on auth state and current page
    // This now runs *after* we know who the user is
    updateUI();

    // Run page-specific logic
    if (document.getElementById('map-container') && typeof initLeafletIfPresent === 'function') {
        initLeafletIfPresent();
    }
    if (document.getElementById('communityFeed') && typeof populateFeed === 'function') {
        populateFeed();
        populateActiveAlerts();
        populateTrendingTopics();
    }
    if (document.getElementById('routeList') && typeof setupSafeRoutes === 'function') {
        setupSafeRoutes();
    }
    if (document.getElementById('weatherAlerts') && typeof setupWeatherAlerts === 'function') {
        setupWeatherAlerts();
    }
}

// =====================================================================
// Event Listener Setup
// =====================================================================
function setupEventListeners() {
    // Global close (click outside to close menus/modals)
    document.addEventListener('click', e => {
        if (userMenuOpen && !e.target.closest('.user-dropdown') && typeof closeUserMenu === 'function') {
            closeUserMenu();
        }
        if (e.target.classList.contains('modal') && typeof closeModal === 'function') {
            closeModal(e.target.id);
        }
    });

    // Global Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (typeof closeModal === 'function') {
                document.querySelectorAll('.modal.show').forEach(m => closeModal(m.id));
            }
            if (typeof closeUserMenu === 'function') closeUserMenu();
            if (typeof closeMobileMenu === 'function') closeMobileMenu();
        }
    });
}

// =====================================================================
// UI Updates
// =====================================================================
/**
 * Updates the UI based on the current auth state.
 */
function updateUI() {
    const authButtons = document.getElementById('authButtons');
    const userDropdown = document.getElementById('userDropdown');
    const dashboardLink = document.getElementById('dashboardLink');
    const mobileDashboardLink = document.getElementById('mobileDashboardLink');

    // If nav elements aren't on this page, just update nav and bail
    if (!authButtons || !userDropdown || !dashboardLink || !mobileDashboardLink) {
        updateActiveNavigation();
        return;
    }

    if (currentUser) {
        authButtons.style.display = 'none';
        userDropdown.style.display = 'block';
        dashboardLink.style.display = 'flex';
        mobileDashboardLink.style.display = 'block';

        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const userDisplayName = document.getElementById('userDisplayName');
        const userEmail = document.getElementById('userEmail');

        if (userAvatar && typeof getUserInitials === 'function') {
            userAvatar.textContent = getUserInitials(currentUser.name);
        }
        if (userName) userName.textContent = currentUser.name;
        if (userDisplayName) userDisplayName.textContent = currentUser.name;
        if (userEmail) userEmail.textContent = currentUser.email;
    } else {
        authButtons.style.display = 'flex';
        userDropdown.style.display = 'none';
        dashboardLink.style.display = 'none';
        mobileDashboardLink.style.display = 'none';
    }

    updateActiveNavigation();
}

/**
 * Sets the 'active' class on the correct nav link based on the current page URL.
 */
function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop();

    // Define a mapping of PHP files to their link's href attribute
    const pageMap = {
        'index.php': 'index.php',
        'map.php': 'map.php',
        'community.php': 'community.php',
        '': 'index.php' // Handle root path
    };

    const activePageHref = pageMap[currentPage] || 'index.php';

    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activePageHref) {
            link.classList.add('active');
        }
    });
}

// =====================================================================
// Global Error Handling
// =====================================================================
window.addEventListener('error', e => {
    console.error('JavaScript error:', e.error || e.message);
    if (e.message && !e.message.includes("null") && typeof showToast === 'function') {  
        showToast('An error occurred. Please refresh the page.', 'error');
    }
});

window.addEventListener('load', () => {
    if (performance && performance.now) {
        console.log('Page loaded in:', performance.now(), 'ms');
    }
});