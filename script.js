// =====================================================================
// Dis is wer da majik hapens heheheheheheheheh
// =====================================================================

// ===== Global State =====
let currentPage = 'home';
let currentUser = null;
let userMenuOpen = false;
let mobileMenuOpen = false;
let map;

// =====================================================================
// App Initialization
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();

  // Safe Routes + Weather Alerts (map page extra content)
  setupSafeRoutes();
  setupWeatherAlerts();

  // Community mocks
  populateComments();
  populateActiveAlerts();
  populateTrendingTopics();

  // Leaflet map (only if present & loaded)
  initLeafletIfPresent();
});

function initializeApp() {
  loadUserFromStorage();
  setupEventListeners();
  updateUI();
  populateContent();
  navigateToPage('home');
}

// =====================================================================
// User state
// =====================================================================
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

// =====================================================================
// Event Listener
// =====================================================================
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

  // Global close (click outside ma Escape siya)
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

// =====================================================================
// UI Updates
// =====================================================================
function updateUI() {
  const authButtons = document.getElementById('authButtons');
  const userDropdown = document.getElementById('userDropdown');
  const dashboardLink = document.getElementById('dashboardLink');
  const mobileDashboardLink = document.getElementById('mobileDashboardLink');

  // If nav elements aren't on this page, just bail out gracefully
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

    if (userAvatar) userAvatar.textContent = getUserInitials(currentUser.name);
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

function updateActiveNavigation() {
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === currentPage) {
      link.classList.add('active');
    }
  });
}

function getUserInitials(name) {
  return name.trim().split(' ').map(w => w[0].toUpperCase()).join('').substring(0, 2);
}

// =====================================================================
// nav.php
// =====================================================================
function navigateToPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const targetPage = document.getElementById(page + 'Page');
  if (targetPage) {
    targetPage.classList.add('active');
    currentPage = page;
    updateActiveNavigation();
    closeMobileMenu();

    if (page === 'dashboard' && typeof populateDashboardContent === 'function') {
      populateDashboardContent();
    }
    if (page === 'map') console.log('Map page loaded');
  }
}

// =====================================================================
// Modals (Pop up log in & sign up)
// =====================================================================
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
    setTimeout(() => (modal.style.display = 'none'), 250);

    const form = modal.querySelector('form');
    if (form) form.reset();
  }
}

// =====================================================================
// menu
// =====================================================================
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

// =====================================================================
// Authentication mag log in
// =====================================================================
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

function logoutUser() {

  const dropdown = document.querySelector(".dropdown-menu.show");
  if (dropdown) dropdown.classList.remove("show");

  const modals = document.querySelectorAll(".modal.show");
  modals.forEach(m => m.classList.remove("show"));
}

// =====================================================================
// Toast (pop up nga red or green)
// =====================================================================
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

// =====================================================================
// Utils
// =====================================================================
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
}

// =====================================================================
// Safe Routes and Weather Alert contents
// =====================================================================
function setupSafeRoutes() {
  const routeList = document.getElementById("routeList");
  if (!routeList) return;

  const routes = [
    { name: "Route A", details: "Dalton St, The Upper East", safety: "Safe", className: "route-safe" },
    { name: "Route B", details: "Galo St, The Upper East", safety: "Moderate", className: "route-medium" },
    { name: "Route C", details: "Lopez Jaena St, Brgy. 30", safety: "Unsafe", className: "route-low" }
  ];

  routes.forEach(route => {
    const div = document.createElement("div");
    div.className = `route-card ${route.className}`;
    div.innerHTML = `
      <div class="route-name">${route.name}</div>
      <div class="route-details">${route.details}</div>
      <div class="route-safety">Safety: ${route.safety}</div>
    `;
    routeList.appendChild(div);
  });
}

function setupWeatherAlerts() {
  const weatherContainer = document.getElementById("weatherAlerts");
  if (!weatherContainer) return; 

  const weatherAlerts = [
    { icon: "fas fa-cloud-rain", message: "Heavy rain expected at 4 PM" },
    { icon: "fas fa-bolt", message: "Thunderstorm warning until 6 PM" },
    { icon: "fas fa-temperature-high", message: "Heat index at 38°C" }
  ];

  weatherAlerts.forEach(alert => {
    const div = document.createElement("div");
    div.className = "weather-alert";
    div.innerHTML = `
      <i class="${alert.icon}"></i>
      <span>${alert.message}</span>
    `;
    weatherContainer.appendChild(div);
  });
}

// =====================================================================
// Error pop up nga Toast
// =====================================================================
window.addEventListener('error', e => {
  console.error('JavaScript error:', e.error || e.message);
  if (e.message && !e.message.includes("null")) {  
    showToast('An error occurred. Please refresh the page.', 'error');
  }
});

window.addEventListener('load', () => {
  if (performance && performance.now) {
    console.log('Page loaded in:', performance.now(), 'ms');
  }
});

// =====================================================================
// Leaflet JS Map
// =====================================================================

function initLeafletIfPresent() {
  const mapEl = document.getElementById("map-container");
  if (!mapEl) return; // ✅ Skip if map not on this page

  const map = L.map(mapEl).setView([10.664648, 122.962439], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}




// =====================================================================
// community.php (mock contents)
// =====================================================================
const mockComments = [
  { user: { name: 'Joshua Garcia', initials: 'SP' }, content: 'Swabe di joggingan guys!', time: '1 minute ago' },
  { user: { name: 'Rob Deniel', initials: 'JS' }, content: 'Nandito ako umiibig sayo, kahit na nagdurugo ang puso!!!', time: '5 hours ago' },
  { user: { name: 'Ryan Paul Delamar', initials: 'JS' }, content: 'Chillin lang di megaworld. Kaon tapos jog hahahaha', time: '1 day ago' }
];

const mockActiveAlerts = [
  { type: 'Construction', location: 'BS Aquino Drv.', level: 'warning' },
  { type: 'Road Hazard', location: 'Lacson St.', level: 'danger' },
  { type: 'Poor Lighting', location: 'Circumferrencial Rd.', level: 'caution' }
];

const mockTrendingTopics = [
  '#SafetyFirst', '#iGPTLangNa', '#AnswerDaBi',
  '#HiGuys', '#HelloWorld', '#WayneAndFriends',
  '#AnoJay?', '#AlaKaDerrrrr', '#AnoNaMan?'
];

function populateComments() {
  const commentsList = document.getElementById('commentsList');
  if (!commentsList) return;

  commentsList.innerHTML = '';
  mockComments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
      <div class="comment-avatar">${comment.user.initials}</div>
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-author">${comment.user.name}</span>
          <span class="comment-time">added a comment ${comment.time}</span>
          <button class="comment-menu"><i class="fas fa-ellipsis-h"></i></button>
        </div>
        <p class="comment-text">${comment.content}</p>
      </div>
    `;
    commentsList.appendChild(commentElement);
  });
}

function populateActiveAlerts() {
  const activeAlerts = document.getElementById('activeAlerts');
  if (!activeAlerts) return;

  activeAlerts.innerHTML = '';
  mockActiveAlerts.forEach(alert => {
    const el = document.createElement('div');
    el.className = `alert-item alert-${alert.level}`;
    el.innerHTML = `
      <div class="alert-type">${alert.type}</div>
      <div class="alert-location">${alert.location}</div>
    `;
    activeAlerts.appendChild(el);
  });
}

function populateTrendingTopics() {
  const trendingTopics = document.getElementById('trendingTopics');
  if (!trendingTopics) return;

  trendingTopics.innerHTML = '';
  mockTrendingTopics.forEach(topic => {
    const tag = document.createElement("a");
tag.className = "topic-tag";
tag.href = `#${topic.replace('#', '')}`;
tag.textContent = topic;
trendingTopics.appendChild(tag);
  });
}

// =====================================================================
// Stubs so clicks don't crash (optional / mock behavior)
// =====================================================================
function handleShareSubmission(e) { if (e && e.preventDefault) e.preventDefault(); showToast('Shared', 'info'); }
function handleQuickAction(label) { showToast(`${label} clicked`, 'info'); }
function handleCommentSubmission() { showToast('Comment submitted', 'info'); }
