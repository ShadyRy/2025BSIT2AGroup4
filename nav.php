<!-- Navigation -->
<nav class="navbar">
    <div class="nav-container">
        <div class="nav-left">
            <h1 class="nav-logo">WALKABLES</h1>
            
            <div class="nav-links" id="navLinks">
                <a href="index.php" class="nav-link active">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </a>
                
                <a href="map.php" class="nav-link">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Map</span>
                </a>
                
                <a href="community.php" class="nav-link">
                    <i class="fas fa-users"></i>
                    <span>Community</span>
                </a>
                
                <a href="#" class="nav-link" id="dashboardLink" style="display: none;">
                    <i class="fas fa-chart-bar"></i>
                    <span>Dashboard</span>
                </a>
            </div>
        </div>

        <div class="nav-right">
    <!-- Auth buttons (shown when not logged in) -->
    <div class="auth-buttons" id="authButtons">
        <button onclick="openModal('loginModal')" class="btn btn-ghost">
            Log in
        </button>
        <button onclick="openModal('signupModal')" class="btn btn-light">
            Sign up
        </button>
    </div>

            <!-- User dropdown (shown when logged in) -->
            <div class="user-dropdown" id="userDropdown" style="display: none;">
                <button onclick="toggleUserMenu()" class="user-button">
                    <div class="user-avatar" id="userAvatar"></div>
                    <span class="user-name" id="userName"></span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                
                <div id="userMenu" class="dropdown-menu">
                    <div class="dropdown-header">
                        <p class="user-display-name" id="userDisplayName"></p>
                        <p class="user-email" id="userEmail"></p>
                    </div>
                    <button onclick="handleLogout()" class="dropdown-item logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Log out</span>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Mobile menu button -->
        <button class="mobile-menu-btn" onclick="toggleMobileMenu()">
            <i class="fas fa-bars"></i>
        </button>
    </div>
    
    <!-- Mobile menu -->
    <div id="mobileMenu" class="mobile-menu">
    <a href="index.php" class="mobile-nav-link active">
        <i class="fas fa-home"></i>
        <span>Home</span>
    </a>
    
    <a href="map.php" class="mobile-nav-link">
        <i class="fas fa-map-marker-alt"></i>
        <span>Map</span>
    </a>
    
    <a href="community.php" class="mobile-nav-link">
        <i class="fas fa-users"></i>
        <span>Community</span>
    </a>
    
    <a href="#" class="mobile-nav-link" id="mobileDashboardLink" style="display: none;">
        <i class="fas fa-chart-bar"></i>
        <span>Dashboard</span>
    </a>
</div>
</nav>

<!-- Login Modal -->
<div id="loginModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3>Log in</h3>
      <button onclick="closeModal('loginModal')" class="close-btn">&times;</button>
    </div>
    <form class="modal-form" onsubmit="handleLogin(event)">
      <div class="form-group">
        <label for="loginEmail">Email</label>
        <input type="email" id="loginEmail" name="email" required>
      </div>
      <div class="form-group">
        <label for="loginPassword">Password</label>
        <input type="password" id="loginPassword" name="password" required>
      </div>
      <div class="modal-buttons">
        <button type="submit" class="btn btn-primary">Log in</button>
        <button type="button" class="btn btn-outline" onclick="closeModal('loginModal')">Cancel</button>
      </div>
    </form>
    <div class="demo-credentials">
      <p>Demo Account:</p>
      <p>Email: demo@walkables.com</p>
      <p>Password: password</p>
    </div>
  </div>
</div>

<!-- Signup Modal -->
<div id="signupModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3>Sign up</h3>
      <button onclick="closeModal('signupModal')" class="close-btn">&times;</button>
    </div>
    <form class="modal-form" onsubmit="handleSignup(event)">
      <div class="form-group">
        <label for="signupName">Name</label>
        <input type="text" id="signupName" name="name" required>
      </div>
      <div class="form-group">
        <label for="signupEmail">Email</label>
        <input type="email" id="signupEmail" name="email" required>
      </div>
      <div class="form-group">
        <label for="signupPassword">Password</label>
        <input type="password" id="signupPassword" name="password" required>
      </div>
      <div class="form-group">
        <label for="signupConfirmPassword">Confirm Password</label>
        <input type="password" id="signupConfirmPassword" name="confirm_password" required>
      </div>
      <div class="modal-buttons">
        <button type="submit" class="btn btn-primary">Sign up</button>
        <button type="button" class="btn btn-outline" onclick="closeModal('signupModal')">Cancel</button>
      </div>
    </form>
  </div>
</div>

<!-- Toast container -->
<div id="toast-container" class="toast-container"></div>