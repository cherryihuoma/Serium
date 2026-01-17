// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // Initialize Charts
    initializeCharts();

    // Sidebar Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            if (!this.querySelector('svg')) return;

            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Animate stat cards on load
    animateStatCards();

    // Update time periodically
    updateActivityTimes();
    setInterval(updateActivityTimes, 60000); // Update every minute

    console.log('SIRIUM Dashboard Loaded');
});

// Initialize Charts
function initializeCharts() {
    // Revenue Chart
    const revenueContainer = document.getElementById('revenueChart');
    if (revenueContainer) {
        drawRevenueChartSVG(revenueContainer);
    }

    // Traffic Chart
    const trafficContainer = document.getElementById('trafficChart');
    if (trafficContainer) {
        drawTrafficChartHTML(trafficContainer);
    }
}

// Draw Revenue Chart using SVG
function drawRevenueChartSVG(container) {
    const data = [3200, 4100, 3800, 5200, 4800, 6100, 5700];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const maxValue = Math.max(...data) * 1.2;

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    let svg = `<svg width="${width}" height="${height}" style="display: block;">`;

    // Grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        svg += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
    }

    // Build path for line
    let pathData = '';
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;

        if (index === 0) {
            pathData += `M ${x} ${y}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }
    });

    // Draw line
    svg += `<path d="${pathData}" stroke="#a855f7" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

    // Draw points
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;

        // Glow
        svg += `<circle cx="${x}" cy="${y}" r="8" fill="rgba(168,85,247,0.3)"/>`;
        // Point
        svg += `<circle cx="${x}" cy="${y}" r="4" fill="#a855f7"/>`;
    });

    // Labels
    labels.forEach((label, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        svg += `<text x="${x}" y="${height - padding + 20}" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="12" font-family="-apple-system, BlinkMacSystemFont, sans-serif">${label}</text>`;
    });

    svg += '</svg>';
    container.innerHTML = svg;
}

// Draw Traffic Chart using HTML/CSS
function drawTrafficChartHTML(container) {
    const data = [
        { label: 'Direct', value: 45, color: '#3b82f6' },
        { label: 'Social', value: 30, color: '#a855f7' },
        { label: 'Referral', value: 15, color: '#22c55e' },
        { label: 'Other', value: 10, color: '#f97316' }
    ];

    let html = '<div style="display: flex; flex-direction: column; gap: 15px; height: 100%; justify-content: center;">';

    data.forEach(item => {
        html += `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 12px; height: 12px; background: ${item.color}; border-radius: 3px; flex-shrink: 0;"></div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <span style="color: rgba(255,255,255,0.8); font-size: 14px;">${item.label}</span>
                        <span style="color: rgba(255,255,255,0.6); font-size: 13px;">${item.value}%</span>
                    </div>
                    <div style="height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; background: ${item.color}; width: ${item.value}%; border-radius: 4px; transition: width 1s ease;"></div>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;

    // Animate bars
    setTimeout(() => {
        container.querySelectorAll('[style*="width:"]').forEach(bar => {
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = bar.getAttribute('data-width') || bar.style.width;
            }, 100);
        });
    }, 100);
}

// Animate stat cards
function animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, index * 100);
    });
}

// Update activity times
function updateActivityTimes() {
    const times = document.querySelectorAll('.activity-time');
    times.forEach(time => {
        const text = time.textContent;
        if (text.includes('minutes ago')) {
            const minutes = parseInt(text);
            if (!isNaN(minutes)) {
                time.textContent = `${minutes + 1} minutes ago`;
            }
        }
    });
}

// Stat counter animation
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Add hover effect to cards
document.querySelectorAll('.stat-card, .chart-card, .activity-card, .quick-actions-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transition = 'all 0.3s ease';
        this.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.boxShadow = '';
    });
});

// Quick action buttons
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const actionName = this.querySelector('span').textContent;
        console.log(`Action clicked: ${actionName}`);

        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;

        this.style.position = 'relative';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);