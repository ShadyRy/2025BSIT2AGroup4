// Walkables Application - Pure JavaScript

// Global state
let currentPage = 'home';
let currentUser = null;
let userMenuOpen = false;
let mobileMenuOpen = false;

// Mock data (only keep for dashboard demo)
const mockActivity = [
    { title: 'Completed Central Park Route', description: 'Safe 5.2km run with no incidents', time: '2 hours ago' },
    { title: 'Reported Road Hazard', description: 'Pothole on 5th Avenue bike lane', time: '5 hours ago' },
    { title: 'Shared Route with Community', description: 'Morning jogging route through Brooklyn', time: '1 day ago' }
];

// ===== App Init =====
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    loadUserFromStorage();
    setupEventListeners();
    updateUI();
    populateContent();
    navigateToPage('home');
}

// ===== User State =====
function loadUserFromStorage() {
    const savedUser = localStorage.getItem('walkables-user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch {
            localStorage.removeItem('walkables-user');
        }
    }
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.addEventListener('click', e => {
            const page = link.getAttribute('data-page');
            if (page) {
                e.preventDefault();
                navigateToPage(page);
            }
        });
    });

    // Global close (click outside, Escape)
    document.addEventListener('click', e => {
        if (userMenuOpen && !e.target.closest('.user-dropdown')) closeUserMenu();
        if (e.target.classList.contains('modal')) closeModal(e.target.id);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(m => closeModal(m.id));
            closeUserMenu();
            closeMobileMenu();
        }
    });
}

// ===== UI Update =====
function updateUI() {
    const authButtons = document.getElementById('authButtons');
    const userDropdown = document.getElementById('userDropdown');
    const dashboardLink = document.getElementById('dashboardLink');
    const mobileDashboardLink = document.getElementById('mobileDashboardLink');

    if (currentUser) {
        authButtons.style.display = 'none';
        userDropdown.style.display = 'block';
        dashboardLink.style.display = 'flex';
        mobileDashboardLink.style.display = 'block';

        document.getElementById('userAvatar').textContent = getUserInitials(currentUser.name);
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userDisplayName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
    } else {
        authButtons.style.display = 'flex';
        userDropdown.style.display = 'none';
        dashboardLink.style.display = 'none';
        mobileDashboardLink.style.display = 'none';
    }

    updateActiveNavigation();
}

function updateActiveNavigation() {
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === currentPage) link.classList.add('active');
    });
}

function getUserInitials(name) {
    return name.trim().split(' ').map(w => w[0].toUpperCase()).join('').substring(0, 2);
}

// ===== Navigation =====
function navigateToPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
        updateActiveNavigation();
        closeMobileMenu();

        if (page === 'dashboard') populateDashboardContent();
    }
}

// ===== Modals =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        requestAnimationFrame(() => modal.classList.add('show'));

        const firstInput = modal.querySelector('input:not([type="hidden"])');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => (modal.style.display = 'none'), 250); // fade-out delay
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

// ===== Menus =====
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenuOpen = !userMenuOpen;
        userMenu.classList.toggle('show', userMenuOpen);
    }
}
function closeUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) userMenu.classList.remove('show');
    userMenuOpen = false;
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenuOpen = !mobileMenuOpen;
        mobileMenu.classList.toggle('show', mobileMenuOpen);
    }
}
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) mobileMenu.classList.remove('show');
    mobileMenuOpen = false;
}

// ===== Authentication =====
function handleLogin(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = fd.get('email').trim();
    const password = fd.get('password').trim();

    if (!email || !password) return showToast('Email and password are required.', 'error');

    if (email === 'demo@walkables.com' && password === 'password') {
        currentUser = { name: 'Demo User', email };
        localStorage.setItem('walkables-user', JSON.stringify(currentUser));
        closeModal('loginModal');
        updateUI();
        showToast('Successfully logged in!', 'success');
    } else {
        showToast('Invalid email or password. Try demo@walkables.com / password', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name').trim();
    const email = fd.get('email').trim();
    const password = fd.get('password').trim();
    const confirmPassword = fd.get('confirm_password').trim();

    if (!name || !email || !password || !confirmPassword) return showToast('All fields are required.', 'error');
    if (name.length < 2) return showToast('Name must be at least 2 characters.', 'error');
    if (!isValidEmail(email)) return showToast('Please enter a valid email.', 'error');
    if (password.length < 6) return showToast('Password must be at least 6 characters.', 'error');
    if (password !== confirmPassword) return showToast('Passwords do not match.', 'error');
    if (email === 'demo@walkables.com') return showToast('An account with this email already exists.', 'error');

    currentUser = { name, email };
    localStorage.setItem('walkables-user', JSON.stringify(currentUser));
    closeModal('signupModal');
    updateUI();
    showToast('Account created successfully!', 'success');
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('walkables-user');
    navigateToPage('home');
    updateUI();
    closeUserMenu();
    showToast('Successfully logged out!', 'success');
}

// ===== Toasts =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="close-btn">
            <i class="fas fa-times"></i>
        </button>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 5000);
}

// ===== Dashboard Page =====
function populateDashboardContent() {
    if (!currentUser) {
        navigateToPage('home');
        return showToast('Please log in to access the dashboard.', 'error');
    }
    populateActivity();
}
function populateActivity() {
    const list = document.getElementById('activityList');
    if (!list) return;
    list.innerHTML = '';
    mockActivity.forEach(a => {
        list.innerHTML += `
            <div class="activity-item">
                <h4>${a.title}</h4>
                <p>${a.description}</p>
                <p style="margin-top: 0.5rem; color: var(--walkables-dark); font-size: var(--text-xs);">${a.time}</p>
            </div>`;
    });
}

// ===== Utils =====
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
function populateContent() {
    // Placeholder for static content
}

// ===== Error Handling =====
window.addEventListener('error', e => {
    console.error('JavaScript error:', e.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});
window.addEventListener('load', () => {
    console.log('Page loaded in:', performance.now(), 'ms');
});
