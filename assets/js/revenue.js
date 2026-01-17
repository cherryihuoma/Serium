// Sample revenue data
const revenueData = {
    revenue: [3200, 4100, 3800, 5200, 4800, 6100, 5700, 6500, 5900, 7200, 6800, 7500],
    profit: [2400, 3200, 2900, 4100, 3700, 4900, 4500, 5200, 4700, 5800, 5400, 6100],
    expenses: [800, 900, 900, 1100, 1100, 1200, 1200, 1300, 1200, 1400, 1400, 1400]
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

    // Initialize all charts
    drawMiniCharts();
    drawMainRevenueChart('revenue');
    drawRevenueSourcesChart();

    // Chart tabs functionality
    const chartTabs = document.querySelectorAll('.chart-tab');
    chartTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            chartTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const chartType = this.getAttribute('data-chart');
            drawMainRevenueChart(chartType);
        });
    });

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function () {
            showNotification('Exporting revenue data...', 'success');
        });
    }

    // Time filter
    const timeFilter = document.querySelector('.time-filter');
    if (timeFilter) {
        timeFilter.addEventListener('change', function () {
            showNotification(`Viewing data for: ${this.options[this.selectedIndex].text}`, 'info');
        });
    }

    console.log('SIRIUM Revenue Page Loaded');
});

// Draw mini charts for stat cards
function drawMiniCharts() {
    const miniChartIds = ['totalRevenueChart', 'avgMonthlyChart', 'thisMonthChart', 'todayChart'];

    miniChartIds.forEach(id => {
        const container = document.getElementById(id);
        if (!container) return;

        const data = generateMiniChartData();
        const width = container.offsetWidth;
        const height = 40;

        let svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">`;

        const maxValue = Math.max(...data);
        const step = width / (data.length - 1);

        let pathData = '';
        data.forEach((value, index) => {
            const x = index * step;
            const y = height - (value / maxValue) * height;

            if (index === 0) {
                pathData += `M ${x} ${y}`;
            } else {
                pathData += ` L ${x} ${y}`;
            }
        });

        // Gradient fill
        svg += `<defs>
            <linearGradient id="miniGrad${id}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="rgba(168, 85, 247, 0.4)"/>
                <stop offset="100%" stop-color="rgba(168, 85, 247, 0)"/>
            </linearGradient>
        </defs>`;

        // Area
        svg += `<path d="${pathData} L ${width} ${height} L 0 ${height} Z" fill="url(#miniGrad${id})"/>`;

        // Line
        svg += `<path d="${pathData}" stroke="#a855f7" stroke-width="2" fill="none"/>`;

        svg += '</svg>';
        container.innerHTML = svg;
    });
}

// Generate random data for mini charts
function generateMiniChartData() {
    const data = [];
    for (let i = 0; i < 12; i++) {
        data.push(Math.random() * 100 + 50);
    }
    return data;
}

// Draw main revenue chart
function drawMainRevenueChart(type) {
    const container = document.getElementById('mainRevenueChart');
    if (!container) return;

    const data = revenueData[type];
    const width = container.offsetWidth;
    const height = 350;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxValue = Math.max(...data) * 1.2;

    let svg = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">`;

    // Grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        svg += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;

        // Y-axis labels
        const value = Math.round(maxValue - (maxValue / 5) * i);
        svg += `<text x="${padding - 10}" y="${y + 4}" text-anchor="end" fill="rgba(255,255,255,0.4)" font-size="12">$${(value / 1000).toFixed(1)}k</text>`;
    }

    // Build path
    let pathData = '';
    let areaPath = '';
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;

        if (index === 0) {
            pathData += `M ${x} ${y}`;
            areaPath += `M ${x} ${height - padding}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }
        areaPath += ` L ${x} ${y}`;
    });
    areaPath += ` L ${padding + chartWidth} ${height - padding} Z`;

    // Gradient
    const colors = {
        revenue: { start: 'rgba(168, 85, 247, 0.3)', end: 'rgba(168, 85, 247, 0)', stroke: '#a855f7' },
        profit: { start: 'rgba(34, 197, 94, 0.3)', end: 'rgba(34, 197, 94, 0)', stroke: '#22c55e' },
        expenses: { start: 'rgba(239, 68, 68, 0.3)', end: 'rgba(239, 68, 68, 0)', stroke: '#ef4444' }
    };

    const color = colors[type];

    svg += `<defs>
        <linearGradient id="mainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${color.start}"/>
            <stop offset="100%" stop-color="${color.end}"/>
        </linearGradient>
    </defs>`;

    // Area
    svg += `<path d="${areaPath}" fill="url(#mainGrad)"/>`;

    // Line
    svg += `<path d="${pathData}" stroke="${color.stroke}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

    // Points
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;

        svg += `<circle cx="${x}" cy="${y}" r="5" fill="${color.stroke}"/>`;
        svg += `<circle cx="${x}" cy="${y}" r="8" fill="${color.stroke}" opacity="0.3"/>`;
    });

    // X-axis labels
    months.forEach((label, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        svg += `<text x="${x}" y="${height - padding + 20}" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="12">${label}</text>`;
    });

    svg += '</svg>';
    container.innerHTML = svg;
}

// Draw revenue sources chart (horizontal bars)
function drawRevenueSourcesChart() {
    const container = document.getElementById('revenueSourcesChart');
    if (!container) return;

    const sources = [
        { label: 'Products', value: 36.3, color: '#3b82f6' },
        { label: 'Subscriptions', value: 31.2, color: '#22c55e' },
        { label: 'Services', value: 20.6, color: '#a855f7' },
        { label: 'Affiliate', value: 11.9, color: '#f97316' }
    ];

    let html = '<div style="display: flex; flex-direction: column; gap: 20px; padding: 20px 0;">';

    sources.forEach(source => {
        html += `
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 600;">${source.label}</span>
                    <span style="color: rgba(255,255,255,0.6); font-size: 13px;">${source.value}%</span>
                </div>
                <div style="height: 12px; background: rgba(255,255,255,0.05); border-radius: 6px; overflow: hidden;">
                    <div style="height: 100%; background: ${source.color}; width: 0%; border-radius: 6px; transition: width 1s ease 0.3s;" class="source-bar" data-width="${source.value}%"></div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;

    // Animate bars
    setTimeout(() => {
        document.querySelectorAll('.source-bar').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
        });
    }, 100);
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

// Add animations
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

// Redraw charts on window resize
let resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        drawMiniCharts();
        const activeTab = document.querySelector('.chart-tab.active');
        if (activeTab) {
            drawMainRevenueChart(activeTab.getAttribute('data-chart'));
        }
        drawRevenueSourcesChart();
    }, 250);
});