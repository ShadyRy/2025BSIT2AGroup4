<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- CSS links -->
    <link rel="stylesheet" href="assets/css/global.css">
    <link rel="stylesheet" href="assets/css/nav.css">
    <link rel="stylesheet" href="assets/css/community.css">
    <link rel="stylesheet" href="assets/css/footer.css">
    <!-- Link to icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" referrerpolicy="no-referrer" />

    <title>WALKABLES</title>

</head>
<body>

<?php require __DIR__ . '/view/nav.php'; ?>

<div id="toast-container" class="toast-container"></div>


    <main> <div class="community-page">
        <div class="container">
        <div class="community-layout">
                    
                <div class="community-main">
                    <div class="card">
                        <div class="card-header">
                            <h3>Share with the Community</h3>
                        </div>
                            <div class="card-content">
                                <form class="share-form" onsubmit="handleShareSubmission(event)">
                                    <textarea placeholder="Share a safety tip, route recommendation or report an issue..." 
                                    class="share-textarea" id="shareTextarea" rows="3"></textarea>
                                    
                                <div class="share-actions">
                                    <button type="button" class="btn btn-outline">
                                        <i class="fas fa-camera"></i>
                                        <span>Photo</span>
                                    </button>
                                    <button type="button" class="btn btn-outline">
                                        <i class="fas fa-map-marker-alt"></i>
                                        <span>Location</span>
                                    </button>
                                    <button type="submit" class="btn btn-primary ml-auto">
                                        Share
                                    </button>
                                </div>
                                </form>
                    </div>
                </div> <div id="communityFeed">
                    </div>

                </div>

                <div class="community-sidebar">
                    <div class="card">
                        <div class="card-header">
                            <h3>
                                <i class="fas fa-exclamation-triangle"></i>
                                Active Alerts
                            </h3>
                        </div>
                        <div class="card-content">
                            <div class="alerts-list" id="activeAlerts">
                                </div>
                        </div>
                    </div>

                    <div class="card quick-actions-card">
                        <div class="card-header">
                            <h3>Quick Actions</h3>
                        </div>
                        <div class="card-content">
                            <div class="quick-actions">
                                <button class="quick-action-btn" onclick="handleQuickAction('Report Safety Issue')">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    <span>Report Safety Issue</span>
                                </button>
                                <button class="quick-action-btn" onclick="handleQuickAction('Share Route')">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>Share Route</span>
                                </button>
                                <button class="quick-action-btn" onclick="handleQuickAction('Upload Photo')">
                                    <i class="fas fa-upload"></i>
                                    <span>Upload Photo</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3>Trending Topics</h3>
                        </div>
                        <div class="card-content">
                            <div class="trending-topics" id="trendingTopics">
                                </div>
                        </div>
                    </div>
        </div>
        </div>
        </div>
    </main>


<?php require __DIR__ . '/view/footer.php'; ?>

    <script src="assets/js/utils.js"></script>
    <script src="assets/js/auth.js"></script> <script src="assets/js/map.js"></script>
    <script src="assets/js/community.js"></script>
    <script src="assets/js/main.js"></script>
    
</body>
</html>