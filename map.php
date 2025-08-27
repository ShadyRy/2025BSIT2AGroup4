<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" referrerpolicy="no-referrer" />
    

    <!-- Leaflet JS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>

    <title>WALKABLES</title>
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
                    <div id="map-container" class="map-container"></div>
                </div>
            </div>
        </div>
    </main>

    <script src="assets/script.js"></script>
    
</body>
</html>
