<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- CSS links -->
    <link rel="stylesheet" href="assets/css/global.css">
    <link rel="stylesheet" href="assets/css/nav.css">
    <link rel="stylesheet" href="assets/css/index.css">
    <link rel="stylesheet" href="assets/css/footer.css"> 
    <!-- Link to icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" referrerpolicy="no-referrer" />

    <title>WALKABLES</title>

</head>
<body>

<?php require __DIR__ . '/view/nav.php'; ?> <!-- Navigation Bar -->

    <!-- Toasterist -->
    <div id="toast-container" class="toast-container"></div>

    
    <main> <!-- Main Section -->
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

            <!-- Featurist -->
            <section class="features-section">
                <div class="container">
                    <div class="section-header">
                        <h2>Everything you need for safe outdoor activities</h2>
                        <p>Comprehensive safety features designed by runners, for runners. Stay protected while pursuing your healthy life.</p>
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
                                <p>Share experiences, report hazards, and connect with fellow runners in your area.</p>
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
                                <p>Advanced GPS tracking to ensure you never lose your way.</p>
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

        </div>
    </main> 


<?php require __DIR__ . '/view/footer.php'; ?> <!-- Footer -->

    <script src="assets/js/utils.js"></script>
    <script src="assets/js/auth.js"></script> <script src="assets/js/map.js"></script>
    <script src="assets/js/community.js"></script>
    <script src="assets/js/main.js"></script>

</body>
</html>