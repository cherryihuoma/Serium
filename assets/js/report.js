// Sample reports data
const reports = [
    { id: 1, name: 'Q1 Sales Analysis', type: 'sales', date: '2025-01-10', period: 'Q1 2025', status: 'completed' },
    { id: 2, name: 'User Growth Report', type: 'users', date: '2025-01-12', period: 'Dec 2024', status: 'completed' },
    { id: 3, name: 'Financial Summary', type: 'financial', date: '2025-01-14', period: 'Dec 2024', status: 'completed' },
    { id: 4, name: 'Performance Metrics', type: 'performance', date: '2025-01-15', period: 'Week 2', status: 'processing' },
    { id: 5, name: 'Monthly Sales Report', type: 'sales', date: '2025-01-08', period: 'Dec 2024', status: 'completed' },
    { id: 6, name: 'User Engagement Analysis', type: 'users', date: '2025-01-06', period: 'Dec 2024', status: 'completed' },
    { id: 7, name: 'Revenue Breakdown', type: 'financial', date: '2025-01-05', period: 'Q4 2024', status: 'completed' },
    { id: 8, name: 'KPI Dashboard', type: 'performance', date: '2025-01-03', period: 'Dec 2024', status: 'completed' }
];

let filteredReports = [...reports];

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

    // Initialize reports
    renderReports();

    // Generate Report Button
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function () {
            showNotification('Opening report generator...', 'info');
        });
    }

    // Template Cards
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        const btn = card.querySelector('.template-btn');
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const template = card.getAttribute('data-template');
            generateReport(template);
        });
    });

    // Filters
    const reportTypeFilter = document.getElementById('reportTypeFilter');
    const reportPeriodFilter = document.getElementById('reportPeriodFilter');

    if (reportTypeFilter) {
        reportTypeFilter.addEventListener('change', filterReports);
    }

    if (reportPeriodFilter) {
        reportPeriodFilter.addEventListener('change', filterReports);
    }

    // Schedule Report Button
    const scheduleReportBtn = document.getElementById('scheduleReportBtn');
    if (scheduleReportBtn) {
        scheduleReportBtn.addEventListener('click', function () {
            showNotification('Opening report scheduler...', 'info');
        });
    }

    // Scheduled card actions
    const scheduledActions = document.querySelectorAll('.scheduled-actions button');
    scheduledActions.forEach(btn => {
        btn.addEventListener('click', function () {
            const action = this.textContent.trim();
            showNotification(`${action} scheduled report`, 'success');
        });
    });

    console.log('SIRIUM Reports Page Loaded');
});

// Generate Report
function generateReport(type) {
    const templates = {
        sales: 'Sales Report',
        users: 'User Analytics',
        financial: 'Financial Report',
        performance: 'Performance Report'
    };

    showNotification(`Generating ${templates[type]}...`, 'success');

    setTimeout(() => {
        showNotification(`${templates[type]} generated successfully!`, 'success');
    }, 2000);
}

// Filter Reports
function filterReports() {
    const typeFilter = document.getElementById('reportTypeFilter').value;
    const periodFilter = document.getElementById('reportPeriodFilter').value;

    filteredReports = reports.filter(report => {
        const matchesType = typeFilter === 'all' || report.type === typeFilter;

        let matchesPeriod = true;
        if (periodFilter !== 'all') {
            const reportDate = new Date(report.date);
            const today = new Date();

            switch (periodFilter) {
                case 'today':
                    matchesPeriod = reportDate.toDateString() === today.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesPeriod = reportDate >= weekAgo;
                    break;
                case 'month':
                    matchesPeriod = reportDate.getMonth() === today.getMonth() &&
                        reportDate.getFullYear() === today.getFullYear();
                    break;
            }
        }

        return matchesType && matchesPeriod;
    });

    renderReports();
}

// Render Reports Table and Cards
function renderReports() {
    renderReportsTable();
    renderReportsCards();
}

// Render Reports Table (Desktop)
function renderReportsTable() {
    const tbody = document.getElementById('reportsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    filteredReports.forEach(report => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${report.name}</td>
            <td><span class="report-type-badge ${report.type}">${capitalizeFirst(report.type)}</span></td>
            <td>${formatDate(report.date)}</td>
            <td>${report.period}</td>
            <td><span class="status-badge ${report.status}">${capitalizeFirst(report.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="viewReport(${report.id})" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="action-btn" onclick="downloadReport(${report.id})" title="Download">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>
                    <button class="action-btn" onclick="shareReport(${report.id})" title="Share">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Render Reports Cards (Mobile)
function renderReportsCards() {
    const container = document.getElementById('reportsCardsContainer');
    if (!container) return;

    container.innerHTML = '';

    filteredReports.forEach(report => {
        const card = document.createElement('div');
        card.className = 'report-card';
        card.innerHTML = `
            <div class="report-card-header">
                <div>
                    <h4 class="report-card-title">${report.name}</h4>
                    <span class="report-type-badge ${report.type}">${capitalizeFirst(report.type)}</span>
                </div>
                <span class="status-badge ${report.status}">${capitalizeFirst(report.status)}</span>
            </div>
            <div class="report-card-body">
                <div class="report-card-row">
                    <span class="report-card-label">Date Generated</span>
                    <span>${formatDate(report.date)}</span>
                </div>
                <div class="report-card-row">
                    <span class="report-card-label">Period</span>
                    <span>${report.period}</span>
                </div>
            </div>
            <div class="report-card-actions">
                <button class="action-btn" onclick="viewReport(${report.id})" style="flex: 1;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
                <button class="action-btn" onclick="downloadReport(${report.id})" style="flex: 1;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </button>
                <button class="action-btn" onclick="shareReport(${report.id})" style="flex: 1;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Action Functions
function viewReport(id) {
    const report = reports.find(r => r.id === id);
    showNotification(`Opening ${report.name}...`, 'info');
}

function downloadReport(id) {
    const report = reports.find(r => r.id === id);
    showNotification(`Downloading ${report.name}...`, 'success');
}

function shareReport(id) {
    const report = reports.find(r => r.id === id);
    showNotification(`Sharing ${report.name}...`, 'info');
}

// Helper Functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Notification System
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

// Add Animations
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