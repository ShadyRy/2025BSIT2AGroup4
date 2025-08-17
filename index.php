<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" />
    <script src="assets/script.js"></script>
    <title>WALKABLES</title>
</head>
<body>

<?php require __DIR__ . '/view/nav.php'; ?>

    <!-- Toast Container -->
    <div id="toast-container" class="toast-container"></div>

    <!-- Main Content -->
    <main>
        <!-- Home Page -->
        <div class="home-page">

            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <div class="hero-grid">
                        <div class="hero-content">
                            <h1>Safe paths for every journey</h1>
                            <p>Plan safer routes, stay connected with your community, and enjoy peace of mind on every run or ride.</p>
                            
                            <div class="hero-buttons">
                                <a href="map.php" class="btn btn-primary">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Explore Routes
                                </a>
                                <a href="community.php" class="btn btn-secondary">
                                    Join Community
                                </a>
                            </div>
                        </div>

                        <div class="hero-image">
                            <img src="images/pipsJog.jpg" alt="Runners on a safe path">
                        </div>
                    </div>
                </div>
            </section>

            <!-- Features Section -->
            <section class="features-section">
                <div class="container">
                    <div class="section-header">
                        <h2>Everything you need for safe outdoor activities</h2>
                        <p>Comprehensive safety features designed by athletes, for athletes. Stay protected while pursuing your passion.</p>
                    </div>

                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">
                               <i class="fa-solid fa-shield-halved"></i>
                            </div>
                            <div class="feature-content">
                                <h3>Safety First</h3>
                                <p>Real-time safety alerts and route recommendations based on current conditions, crime data, and community reports.</p>
                            </div>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="feature-content">
                                <h3>Smart Route Planning</h3>
                                <p>AI-powered route planning that considers sidewalk conditions, lighting, traffic patterns, and weather.</p>
                            </div>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="feature-content">
                                <h3>Community Driven</h3>
                                <p>Share experiences, report hazards, and connect with fellow runners and cyclists in your area.</p>
                            </div>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="feature-content">
                                <h3>Real-time Alerts</h3>
                                <p>Get instant notifications about accidents, construction, weather changes, and other safety concerns.</p>
                            </div>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-location-arrow"></i>
                            </div>
                            <div class="feature-content">
                                <h3>GPS Tracking</h3>
                                <p>Advanced GPS tracking with offline capabilities to ensure you never lose your way.</p>
                            </div>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-camera"></i>
                            </div>
                            <div class="feature-content">
                                <h3>Incident Reporting</h3>
                                <p>Easily report and document safety issues with photos and location data to help the community.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    
            <!-- Login Modal -->
            <div id="loginModal" class="modal">
                <div class="modal-content">
                <div class="modal-header">
                 <h3>Log in to Walkables</h3>
                    <button onclick="closeModal('loginModal')" class="close-btn">
                    <i class="fas fa-times"></i>
                    </button>
                </div>
            
                <form class="modal-form" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label for="login-email">Email</label>
                        <input type="email" id="login-email" name="email" placeholder="Enter your email" required>
                    </div>

                    <div class="form-group">
                        <label for="login-password">Password</label>
                        <input type="password" id="login-password" name="password" placeholder="Enter your password" required minlength="6">
                    <  /div>

                    <div class="demo-credentials">
                        <p><strong>Demo credentials:</strong></p>
                        <p>Email: demo@walkables.com</p>
                        <p>Password: password</p>
                    </div>

                    <div class="modal-buttons">
                        <button type="submit" class="btn btn-primary">Log in</button>
                        <button type="button" onclick="closeModal('loginModal')" class="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Signup Modal -->
        <div id="signupModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Create your account</h3>
                    <button onclick="closeModal('signupModal')" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            
                <form class="modal-form" onsubmit="handleSignup(event)">
                    <div class="form-group">
                        <label for="signup-name">Full Name</label>
                        <input type="text" id="signup-name" name="name" placeholder="Enter your full name" required minlength="2">
                    </div>

                    <div class="form-group">
                        <label for="signup-email">Email</label>
                        <input type="email" id="signup-email" name="email" placeholder="Enter your email" required>
                    </div>

                    <div class="form-group">
                        <label for="signup-password">Password</label>
                        <input type="password" id="signup-password" name="password" placeholder="Create a password" required minlength="6">
                    </div>

                    <div class="form-group">
                        <label for="signup-confirm-password">Confirm Password</label>
                        <input type="password" id="signup-confirm-password" name="confirm_password" placeholder="Confirm your password" required minlength="6">
                    </div>

                    <div class="modal-buttons">
                        <button type="submit" class="btn btn-primary">Create Account</button>
                        <button type="button" onclick="closeModal('signupModal')" class="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </main>

    

<?php require __DIR__ . '/view/footer.php'; ?>


</body>
</html>