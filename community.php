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

 <!-- Toasterist -->
    <div id="toast-container" class="toast-container"></div>

     
    <main> <!-- Main Content -->

        <!-- Community Page -->
        <div class="community-page">
        <div class="container">
        <div class="community-layout">
                    
                <!-- Left Column -->
                <div class="community-main">
                    <!-- Share with Community -->
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
                </div>

                        <!-- Comments Section -->
                        <div class="card">
                            <div class="card-header">
                                <h3>Comments</h3>
                            </div>
                            <div class="card-content">
                                <div class="comment-form">
                                    <textarea placeholder="Type your comment here" 
                                              class="comment-textarea"
                                              id="commentTextarea"
                                              rows="2"></textarea>
                                    <button type="button" onclick="handleCommentSubmission()" class="btn btn-primary comment-submit">Post Comment</button>
                                </div>
                                
                                <div class="comments-list" id="commentsList">
                                    <!-- Comments will be populated by JavaScript -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="community-sidebar">
                        <!-- Active Alerts -->
                        <div class="card">
                            <div class="card-header">
                                <h3>
                                    <i class="fas fa-exclamation-triangle"></i>
                                    Active Alerts
                                </h3>
                            </div>
                            <div class="card-content">
                                <div class="alerts-list" id="activeAlerts">
                                    <!-- Active alerts will be populated by JavaScript -->
                                </div>
                            </div>
                        </div>

                        <!-- Quick Actions -->
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

                        <!-- Trending Topics -->
                        <div class="card">
                            <div class="card-header">
                                <h3>Trending Topics</h3>
                            </div>
                            <div class="card-content">
                                <div class="trending-topics" id="trendingTopics">
                                    <!-- Trending topics will be populated by JavaScript -->
                                </div>
                            </div>
                        </div>
        </div>
        </div>
        </div>
    </main>

<?php require __DIR__ . '/view/footer.php'; ?>
    
</body>
</html>