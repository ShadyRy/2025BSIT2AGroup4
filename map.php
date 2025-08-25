<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WALKABLES</title>
    <link rel="stylesheet" href="assets/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" /> 
    <script src="assets/script.js"></script>
</head>
<body>

<?php require __DIR__ . '/view/nav.php'; ?>

    <!-- Toasterist -->
    <div id="toast-container" class="toast-container"></div>

     
    <main> <!-- Main Section -->
        
        <div class="map-page"> <!-- I'm the Map -->
            <div class="map-layout">

                <!-- Sidebar -->
                <div class="map-sidebar">
                <div class="sidebar-content">

                    <!-- Search -->
                    <div class="search-section">
                        <div class="search-input">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Search" id="mapSearch">
                        </div>
                    </div>

                    <!-- Filters -->
                        <div class="filters-section">
                            <h3>Filters</h3>
                            <div class="filter-options">
                                <div class="filter-item">
                                    <input type="checkbox" id="wet" name="filters[]" value="wet">
                                    <label for="wet">
                                        <i class="fas fa-cloud-rain"></i>
                                        <span>Wet</span>
                                    </label>
                                </div>
                                
                                <div class="filter-item">
                                    <input type="checkbox" id="crowd" name="filters[]" value="crowd">
                                    <label for="crowd">
                                        <i class="fas fa-users"></i>
                                        <span>Crowd</span>
                                    </label>
                                </div>
                                
                                <div class="filter-item">
                                    <input type="checkbox" id="blocked" name="filters[]" value="blocked">
                                    <label for="blocked">
                                        <i class="fas fa-ban"></i>
                                        <span>Blocked</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                    <!-- Safe Routes -->
                        <div class="routes-section">
                            <h3>Safe Routes</h3>
                            <div class="route-list" id="routeList">
                                <!-- Routes will be populated by JavaScript -->
                            </div>
                        </div>

                        <!-- Weather Alert -->
                        <div class="weather-section">
                            <h3>Weather Alert</h3>
                            <div class="weather-alerts" id="weatherAlerts"></div>
                        </div>
                </div>
                </div>

                <!-- Map Area -->
                <div class="map-area">
                    <div class="map-container">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4242.539716508796!2d122.96036337533836!3d10.664626661245391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aed1bba24e5b2d%3A0x91fd4ec2e45587be!2sThe%20Upper%20East%20by%20Megaworld!5e1!3m2!1sen!2sph!4v1756015881626!5m2!1sen!2sph" 
                            style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" alt="Interactive map" class="map-image" id="mapImage"> </iframe>
                        
                        <!-- Map overlay info -->
                        <div class="map-overlay">
                            <div class="location-info">
                                <h4>Current Location</h4>
                                <p>The Upper East, Bcd</p>
                                <p class="weather-info">Weather: Clear, 36°C</p>
                            </div>
                        </div>
                        
                        <!-- Map controls -->
                        <div class="map-controls">
                            <button class="map-control-btn" onclick="zoomIn()">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="map-control-btn" onclick="zoomOut()">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="map-control-btn" onclick="centerMap()">
                                <i class="fas fa-location-arrow"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    
</body>
</html>
