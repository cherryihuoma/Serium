// Sample user data
const users = [
    { id: 1, name: 'John Doe', username: '@johndoe', email: 'john.doe@example.com', role: 'Admin', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', username: '@janesmith', email: 'jane.smith@example.com', role: 'User', status: 'active', joined: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', username: '@mikej', email: 'mike.j@example.com', role: 'Moderator', status: 'inactive', joined: '2024-03-10' },
    { id: 4, name: 'Sarah Williams', username: '@sarahw', email: 'sarah.w@example.com', role: 'User', status: 'active', joined: '2024-01-25' },
    { id: 5, name: 'Tom Brown', username: '@tombrown', email: 'tom.b@example.com', role: 'User', status: 'pending', joined: '2024-04-05' },
    { id: 6, name: 'Emily Davis', username: '@emilyd', email: 'emily.d@example.com', role: 'Admin', status: 'active', joined: '2024-02-14' },
    { id: 7, name: 'Chris Wilson', username: '@chrisw', email: 'chris.w@example.com', role: 'User', status: 'inactive', joined: '2024-03-22' },
    { id: 8, name: 'Lisa Anderson', username: '@lisaa', email: 'lisa.a@example.com', role: 'Moderator', status: 'active', joined: '2024-01-30' },
    { id: 9, name: 'David Lee', username: '@davidlee', email: 'david.l@example.com', role: 'User', status: 'active', joined: '2024-04-12' },
    { id: 10, name: 'Anna Taylor', username: '@annat', email: 'anna.t@example.com', role: 'User', status: 'pending', joined: '2024-03-18' }
];

let filteredUsers = [...users];
let currentPage = 1;
const usersPerPage = 8;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        });

        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                if (sidebar.classList.contains('active') &&
                    !sidebar.contains(e.target) &&
                    !mobileMenuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                }
            }
        });

        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                }
            });
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
    }

    // Initialize table
    renderTable();
    renderMobileCards();
    updatePagination();

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            filterUsers();
        });
    }

    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    const roleFilter = document.getElementById('roleFilter');

    if (statusFilter) {
        statusFilter.addEventListener('change', filterUsers);
    }

    if (roleFilter) {
        roleFilter.addEventListener('change', filterUsers);
    }

    // Add user button
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function () {
            showNotification('Add user feature coming soon!', 'info');
        });
    }

    // Select all checkbox
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', function () {
            const checkboxes = document.querySelectorAll('.users-table tbody input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = this.checked);
        });
    }

    // Pagination
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
                renderMobileCards();
                updatePagination();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
                renderMobileCards();
                updatePagination();
            }
        });
    }

    console.log('SIRIUM User Table Loaded');
});

// Filter users
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const roleFilter = document.getElementById('roleFilter').value;

    filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
    });

    currentPage = 1;
    renderTable();
    renderMobileCards();
    updatePagination();
}

// Render table (desktop)
function renderTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const pageUsers = filteredUsers.slice(start, end);

    pageUsers.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <input type="checkbox">
            </td>
            <td>
                <div class="user-info">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%234a4a4a'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='40' font-family='Arial'%3E${user.name.charAt(0)}%3C/text%3E%3C/svg%3E" alt="${user.name}" class="user-avatar">
                    <div class="user-details">
                        <h4>${user.name}</h4>
                        <p>${user.username}</p>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td><span class="role-badge">${user.role}</span></td>
            <td><span class="status-badge ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
            <td>${formatDate(user.joined)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="viewUser(${user.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="action-btn" onclick="editUser(${user.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-btn delete" onclick="deleteUser(${user.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Render mobile cards
function renderMobileCards() {
    const container = document.getElementById('mobileCardsContainer');
    if (!container) return;

    container.innerHTML = '';

    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const pageUsers = filteredUsers.slice(start, end);

    pageUsers.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <div class="user-card-header">
                <div class="user-card-info">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%234a4a4a'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='40' font-family='Arial'%3E${user.name.charAt(0)}%3C/text%3E%3C/svg%3E" alt="${user.name}" class="user-avatar">
                    <div class="user-card-details">
                        <h4>${user.name}</h4>
                        <p>${user.email}</p>
                    </div>
                </div>
            </div>
            <div class="user-card-body">
                <div class="user-card-row">
                    <span class="user-card-label">Role</span>
                    <span class="role-badge">${user.role}</span>
                </div>
                <div class="user-card-row">
                    <span class="user-card-label">Status</span>
                    <span class="status-badge ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                </div>
                <div class="user-card-row">
                    <span class="user-card-label">Joined</span>
                    <span>${formatDate(user.joined)}</span>
                </div>
            </div>
            <div class="user-card-actions">
                <button class="action-btn" onclick="viewUser(${user.id})" style="flex: 1;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
                <button class="action-btn" onclick="editUser(${user.id})" style="flex: 1;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="action-btn delete" onclick="deleteUser(${user.id})" style="flex: 1;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const currentPageEl = document.getElementById('currentPage');
    const totalPagesEl = document.getElementById('totalPages');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (currentPageEl) currentPageEl.textContent = currentPage;
    if (totalPagesEl) totalPagesEl.textContent = totalPages;

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

// Action functions
function viewUser(id) {
    const user = users.find(u => u.id === id);
    showNotification(`Viewing ${user.name}`, 'info');
}

function editUser(id) {
    const user = users.find(u => u.id === id);
    showNotification(`Editing ${user.name}`, 'info');
}

function deleteUser(id) {
    const user = users.find(u => u.id === id);
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
        showNotification(`${user.name} deleted successfully`, 'success');
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    const colors = {
        success: { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', text: '#22c55e' },
        error: { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#ef4444' },
        info: { bg: 'rgba(59, 130, 246, 0.2)', border: '#3b82f6', text: '#3b82f6' }
    };

    const color = colors[type] || colors.info;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${color.bg};
        border: 1px solid ${color.border};
        border-radius: 12px;
        color: ${color.text};
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);