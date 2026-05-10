// Authentication management for static ShopHub website

// User data storage (in real app, this would be server-side)
let users = JSON.parse(localStorage.getItem('users')) || [
    {
        id: 1,
        username: 'admin',
        email: 'admin@shop.com',
        password: 'admin123', // In real app, this would be hashed
        phone: '+256783632089',
        address: '123 Admin Street, Nairobi, Kenya',
        is_admin: true,
        created_at: new Date().toISOString()
    }
];

// Current logged-in user
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize default users if none exist
function initializeUsers() {
    if (users.length === 0) {
        users = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@shop.com',
                password: 'admin123',
                phone: '+256783632089',
                address: '123 Admin Street, Nairobi, Kenya',
                is_admin: true,
                created_at: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Register new user
function register(userData) {
    const { username, email, password, phone, address } = userData;
    
    // Check if user already exists
    if (users.find(u => u.username === username)) {
        return { success: false, message: 'Username already exists' };
    }
    
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email already exists' };
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        username,
        email,
        password, // In real app, this would be hashed
        phone: phone || '',
        address: address || '',
        is_admin: false,
        created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Registration successful! Please login.' };
}

// Login user
function login(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
    }
    
    return { success: false, message: 'Invalid username or password' };
}

// Logout user
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    window.location.href = 'index.html';
}

// Check if user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Check if current user is admin
function isAdmin() {
    return currentUser && currentUser.is_admin;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Update authentication UI based on login status
function updateAuthUI() {
    const loginNavItem = document.getElementById('loginNavItem');
    const registerNavItem = document.getElementById('registerNavItem');
    const dashboardNavItem = document.getElementById('dashboardNavItem');
    const adminDropdown = document.getElementById('adminDropdown');
    const userDropdown = document.getElementById('userDropdown');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const heroButton = document.getElementById('heroButton');
    const notificationNavItem = document.getElementById('notificationNavItem');
    const messageNavItem = document.getElementById('messageNavItem');
    
    if (currentUser) {
        // User is logged in
        if (loginNavItem) loginNavItem.style.display = 'none';
        if (registerNavItem) registerNavItem.style.display = 'none';
        if (dashboardNavItem) dashboardNavItem.style.display = 'block';
        if (userDropdown) userDropdown.style.display = 'block';
        if (usernameDisplay) usernameDisplay.textContent = currentUser.username;
        if (heroButton) heroButton.style.display = 'none';
        if (notificationNavItem) notificationNavItem.style.display = 'block';
        if (messageNavItem) messageNavItem.style.display = 'block';
        
        // Update message notifications
        updateMessageNotifications();
        
        // Show admin dropdown if user is admin
        if (currentUser.is_admin && adminDropdown) {
            adminDropdown.style.display = 'block';
        }
    } else {
        // User is not logged in
        if (loginNavItem) loginNavItem.style.display = 'block';
        if (registerNavItem) registerNavItem.style.display = 'block';
        if (dashboardNavItem) dashboardNavItem.style.display = 'none';
        if (adminDropdown) adminDropdown.style.display = 'none';
        if (userDropdown) userDropdown.style.display = 'none';
        if (heroButton) heroButton.style.display = 'block';
        if (notificationNavItem) notificationNavItem.style.display = 'none';
        if (messageNavItem) messageNavItem.style.display = 'none';
    }
}

// Protect routes that require authentication
function requireAuth() {
    if (!isLoggedIn()) {
        flashMessage('Please log in to access this page.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
    return true;
}

// Protect admin routes
function requireAdmin() {
    if (!isLoggedIn()) {
        flashMessage('Please log in to access this page.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
    
    if (!isAdmin()) {
        flashMessage('Access denied. Admin privileges required.', 'error');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        return false;
    }
    return true;
}

// Show flash message
function flashMessage(message, type = 'info') {
    const flashContainer = document.getElementById('flashMessages');
    if (!flashContainer) return;
    
    const alertClass = type === 'error' ? 'danger' : type;
    const alertHtml = `
        <div class="alert alert-${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    flashContainer.innerHTML = alertHtml;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        const alert = flashContainer.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

// Update message notifications
function updateMessageNotifications() {
    if (!window.messageSystem || !isLoggedIn()) return;
    
    const user = getCurrentUser();
    let unreadCount = 0;
    
    if (user.is_admin) {
        // Admin gets count of unread user messages
        unreadCount = window.messageSystem.getUnreadAdminCount();
    } else {
        // Regular user gets count of unread admin replies
        unreadCount = window.messageSystem.getUnreadUserCount(user.id);
    }
    
    // Update notification badge
    const badge = document.getElementById(user.is_admin ? 'messageCount' : 'userMessageCount');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeUsers();
    updateAuthUI();
});

// Export functions for use in other scripts
window.auth = {
    register,
    login,
    logout,
    isLoggedIn,
    isAdmin,
    getCurrentUser,
    requireAuth,
    requireAdmin,
    flashMessage,
    updateMessageNotifications
};
