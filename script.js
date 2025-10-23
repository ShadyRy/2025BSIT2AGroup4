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

async function initLeafletIfPresent() {
  const mapEl = document.getElementById("map-container");
  if (!mapEl) return;

  // global map (top of script has `let map;`)
  map = L.map(mapEl, { zoomControl: false }).setView([10.664648, 122.962439], 17);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution: '&copy; <a href="https://carto.com/">CARTO</a> | Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

  // Helper: check if an image URL loads
  function imageExists(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  // --- Custom Icons (wet always uses wetRoad.png) ---
  const wetIcon = L.icon({
    iconUrl: 'images/wetRoad.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });

  // Try to preload blocked icon; if it fails, fall back to default icon
  const blockedIconUrl = 'images/blockRoad.png';
  const blockedIconAvailable = await imageExists(blockedIconUrl);

  const blockedIcon = blockedIconAvailable
    ? L.icon({ iconUrl: blockedIconUrl, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] })
    : null; // null means use default below

  if (!blockedIconAvailable) {
    console.warn(`[Leaflet] blocked icon "${blockedIconUrl}" failed to load — falling back to default marker icon.`);
    // optionally show a toast for debugging (comment out when done)
    // showToast('Blocked icon not found, using default marker.', 'info');
  }

  // --- Coordinates ---
  const wetPositions = [ // Wet Roads
    [10.663395, 122.965486],
    [10.664237, 122.962064]
  ];

  const crowdPositions = [ // Crowd Tracker
    [10.666379, 122.960089],
    [10.664954, 122.959263]
  ];

  const blockedPositions = [ // Blocked Roads
    [10.662413, 122.965347],
    [10.663197, 122.963485]
  ];

  // --- Suggested Route Coordinates

  const lineCoordinates1 = [ // Green (Upper East)
    [10.665460, 122.959038],
    [10.664206, 122.961946]
  ];

  const lineCoordinates2 = [ // Yellow (Cirucmferrential)
    [10.661371, 122.966301],
    [10.664048, 122.967728]
  ];

  const lineCoordinates3 = [ // Red (Bangga Patyo)
    [10.665323, 122.957300],
    [10.667979, 122.958491]
  ];

  // --- Create layer objects (not added yet) ---
  const wetMarkers = wetPositions.map(coords =>
    L.marker(coords, { icon: wetIcon }).bindPopup("Wet Road Reported")
  );

  const crowdCircles = crowdPositions.map(coords =>
    L.circle(coords, {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: 75
    }).bindPopup("Crowd Reported")
  );

  const roadLine1 = L.polyline(lineCoordinates1, {
    color: "#4CAF50",
    weight: 4,
    opacity: 0.8,
  }).bindPopup("Road connection or route");

  const roadLine2 = L.polyline(lineCoordinates2, {
    color: "#FFC107",
    weight: 4,
    opacity: 0.8,
  }).bindPopup("Road connection or route");

  const roadLine3 = L.polyline(lineCoordinates3, {
    color: "#F44336",
    weight: 4,
    opacity: 0.8,
  }).bindPopup("Road connection or route");

  roadLine1.addTo(map);
  roadLine2.addTo(map);
  roadLine3.addTo(map);

  // If blockedIcon is null, create markers with default icon
  const blockedMarkers = blockedPositions.map(coords => {
    if (blockedIcon) {
      return L.marker(coords, { icon: blockedIcon }).bindPopup("Blocked Road Ahead");
    } else {
      return L.marker(coords).bindPopup("Blocked Road Ahead");
    }
  });

  // Helpers: add/remove arrays of layers
  function addLayerArray(arr, note) {
    arr.forEach(layer => {
      if (!map.hasLayer(layer)) layer.addTo(map);
    });
    if (note) console.log(`Added ${arr.length} ${note} to map.`);
  }
  function removeLayerArray(arr, note) {
    arr.forEach(layer => {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    if (note) console.log(`Removed ${arr.length} ${note} from map.`);
  }

  // --- Checkbox references (these exist in your map.php) ---
  const wetCheckbox = document.getElementById("wet");
  const crowdCheckbox = document.getElementById("crowd");
  const blockedCheckbox = document.getElementById("blocked");

  // Ensure initial visibility according to checkbox state
  if (wetCheckbox) {
    if (wetCheckbox.checked) addLayerArray(wetMarkers, 'wet markers');
    wetCheckbox.addEventListener("change", () => {
      wetCheckbox.checked ? addLayerArray(wetMarkers, 'wet markers') : removeLayerArray(wetMarkers, 'wet markers');
    });
  }

  if (crowdCheckbox) {
    if (crowdCheckbox.checked) addLayerArray(crowdCircles, 'crowd circles');
    crowdCheckbox.addEventListener("change", () => {
      crowdCheckbox.checked ? addLayerArray(crowdCircles, 'crowd circles') : removeLayerArray(crowdCircles, 'crowd circles');
    });
  }

  if (blockedCheckbox) {
    if (blockedCheckbox.checked) addLayerArray(blockedMarkers, 'blocked markers');
    blockedCheckbox.addEventListener("change", () => {
      blockedCheckbox.checked ? addLayerArray(blockedMarkers, 'blocked markers') : removeLayerArray(blockedMarkers, 'blocked markers');
    });
  }

  // If you want them all visible by default (ignore checkboxes), uncomment:
  // addLayerArray(wetMarkers, 'wet markers');
  // addLayerArray(crowdCircles, 'crowd circles');
  // addLayerArray(blockedMarkers, 'blocked markers');

  // --- Custom Zoom Control (unchanged) ---
  const ZoomControl = L.Control.extend({
    options: { position: "topright" },
    onAdd: function(mapInstance) {
      const container = L.DomUtil.create("div", "leaflet-control custom-zoom-control");

      const btnIn = L.DomUtil.create("a", "zoom-btn", container);
      btnIn.innerHTML = '<i class="fas fa-plus"></i>';
      btnIn.href = "#";
      btnIn.title = "Zoom In";

      const btnOut = L.DomUtil.create("a", "zoom-btn", container);
      btnOut.innerHTML = '<i class="fas fa-minus"></i>';
      btnOut.href = "#";
      btnOut.title = "Zoom Out";

      L.DomEvent.on(btnIn, "click", L.DomEvent.stopPropagation)
        .on(btnIn, "click", L.DomEvent.preventDefault)
        .on(btnIn, "click", () => mapInstance.zoomIn());

      L.DomEvent.on(btnOut, "click", L.DomEvent.stopPropagation)
        .on(btnOut, "click", L.DomEvent.preventDefault)
        .on(btnOut, "click", () => mapInstance.zoomOut());

      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);

      return container;
    }
  });

  map.addControl(new ZoomControl());
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
