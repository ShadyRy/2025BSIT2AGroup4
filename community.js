// =====================================================================
// Community Page Specific Logic
// =====================================================================

// Local state for community page
let posts = [];

// Mock Data (for community.php)
const mockPosts = [
{
    id: 10001,
    author: 'Ryan Paul Delamar',
    initials: 'RP',
    text: 'Chillin lang di megaworld. Kaon tapos jog hahahaha',
    date: '1 day ago',
    comments: [{ author: 'Rob Deniel', initials: 'RD', text: 'Nice one pre!', date: '1 day ago' }]
},
{
    id: 10002,
    author: 'Rob Deniel',
    initials: 'RD',
    text: 'Nandito ako umiibig sayo, kahit na nagdurugo ang puso!!!',
    date: '5 hours ago',
    comments: []
},
{
    id: 10003,
    author: 'Joshua Garcia',
    initials: 'JG',
    text: 'Swabe di joggingan guys!',
    date: '1 minute ago',
    comments: []
}
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

/**
 * Populates the "Active Alerts" list on the community page.
 */
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

/**
 * Populates the "Trending Topics" list on the community page.
 */
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

/**
 * Populates the main community feed with mock posts.
 */
function populateFeed() {
    const feed = document.getElementById("communityFeed");
    if (!feed) return;
    feed.innerHTML = '';

    posts = []; 

    const reversedMockPosts = mockPosts.slice().reverse();

    reversedMockPosts.forEach(post => {
        posts.push(post); 
        createPostCard(post);
        if (post.comments && post.comments.length > 0) {
            displayComments(post.id);
        }
    });
}

/**
 * Handles the "Quick Action" button clicks.
 * @param {string} label The label of the button clicked.
 */
function handleQuickAction(label) {
    // Check if user is logged in
    if (!currentUser) {
        showToast('You must be logged in to perform this action.', 'error');
        openModal('loginModal');
        return;
    }

    if (typeof showToast === 'function') {
        showToast(`${label} clicked`, 'info');
    }
}

/**
 * Handles the submission of a new post.
 * @param {Event} event The form submission event.
 */
function handleShareSubmission(event) {
    event.preventDefault();

    // Check if user is logged in
    if (!currentUser) {
        showToast("You must be logged in to share a post.", "error");
        openModal('loginModal');
        return;
    }

    const textarea = document.getElementById("shareTextarea");
    const content = textarea.value.trim();

    if (!content) {
        showToast("Please write something before sharing!", "error");
        return;
    }

    const authorName = currentUser.name; 
    const authorInitials = getUserInitials(currentUser.name);

    const post = {
        id: Date.now(),
        author: authorName,
        initials: authorInitials,
        text: content,
        date: 'Just now',
        comments: []
    };

    posts.unshift(post);
    textarea.value = "";

    createPostCard(post);
}

/**
 * Creates and prepends a new post card to the feed.
 * @param {object} post The post object to render.
 */
function createPostCard(post) { 
    const feed = document.getElementById("communityFeed");
    if (!feed) {
        console.error('Missing #communityFeed element in HTML');
        return;
    }

    const card = document.createElement("div");
    card.className = "card post-card"; 
    card.setAttribute("data-id", post.id);

    // Note: In a real app, sanitize 'post.text' to prevent XSS.
    card.innerHTML = `
        <div class="card-content">
            <div class="comment">
                <div class="comment-avatar">${post.initials}</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${post.author}</span>
                        <span class="comment-time">${post.date}</span>
                    </div>
                    <p class="comment-text">${post.text}</p>
                </div>
            </div>
        </div>
        <div class="card-content post-comments">
            <h4 class="comments-header" style="font-size: 1rem; margin-bottom: 1rem;">Comments</h4>
            <div class="comments-list" id="comments-${post.id}">
                <p class='no-comments' style="font-size: 0.875rem; color: var(--walkables-dark);">No comments yet.</p>
            </div>
            <div class="comment-form">
                <textarea placeholder="Write a comment..." class="comment-textarea" id="comment-${post.id}-textarea" rows="2"></textarea>
                <button type="button" class="btn btn-primary comment-submit" onclick="handleCommentSubmission(${post.id})">Post Comment</button>
            </div>
        </div>
    `;

    if (feed.firstChild) {
        feed.insertBefore(card, feed.firstChild);
    } else {
        feed.appendChild(card);
    }
}

/**
 * Handles the submission of a new comment.
 * @param {number} postId The ID of the post being commented on.
 */
function handleCommentSubmission(postId) {
    // Check if user is logged in
    if (!currentUser) {
        showToast("You must be logged in to comment.", "error");
        openModal('loginModal');
        return;
    }

    const textarea = document.getElementById(`comment-${postId}-textarea`);
    if (!textarea) return;

    const text = textarea.value.trim();
    if (!text) {
        showToast("Please type a comment before posting.", "error");
        return;
    }

    const post = posts.find(p => p.id === postId); 
    if (!post) return;

    const authorName = currentUser.name;
    const authorInitials = getUserInitials(currentUser.name);

    const comment = {
        author: authorName,
        initials: authorInitials,
        text,
        date: 'Just now'
    };

    post.comments.push(comment); 
    textarea.value = "";

    displayComments(postId);
}

/**
 * Renders all comments for a specific post.
 * @param {number} postId The ID of the post to display comments for.
 */
function displayComments (postId) {
    // FIX: Corrected the ID selector here
    const commentsList = document.getElementById('comments-' + postId); 
    const post = posts.find(p => p.id === postId);

    if (!commentsList || !post) return; 

    commentsList.innerHTML = "";

    if (post.comments.length === 0) { 
        commentsList.innerHTML = "<p class='no-comments' style='font-size: 0.875rem; color: var(--walkables-dark);'>No comments yet.</p>";
        return;
    }

    // Note: In a real app, sanitize 'c.text' to prevent XSS.
    post.comments.forEach(c =>{
        const div = document.createElement("div");
        div.className = "comment";
        div.innerHTML = `
            <div class="comment-avatar">${c.initials}</div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${c.author}</span>
                    <span class="comment-time">${c.date}</span>
                </div>
                <p class="comment-text">${c.text}</p>
            </div>
        `;
        commentsList.appendChild(div);
    });
}