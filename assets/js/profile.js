// Wait for DOM to be fully loaded
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

        // Close sidebar when clicking outside on mobile
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

        // Close sidebar when clicking nav items on mobile
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                }
            });
        });

        // Handle window resize
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
    }

    // Edit Personal Information
    const editPersonalInfoBtn = document.getElementById('editPersonalInfo');
    const personalInfoActions = document.getElementById('personalInfoActions');
    const cancelPersonalInfoBtn = document.getElementById('cancelPersonalInfo');
    const savePersonalInfoBtn = document.getElementById('savePersonalInfo');

    const personalInfoInputs = [
        document.getElementById('fullName'),
        document.getElementById('email'),
        document.getElementById('phone'),
        document.getElementById('location'),
        document.getElementById('bio')
    ];

    let originalValues = {};

    if (editPersonalInfoBtn) {
        editPersonalInfoBtn.addEventListener('click', function () {
            // Save original values
            personalInfoInputs.forEach(input => {
                if (input) {
                    originalValues[input.id] = input.value;
                    input.disabled = false;
                }
            });

            personalInfoActions.style.display = 'flex';
            editPersonalInfoBtn.style.display = 'none';
        });
    }

    if (cancelPersonalInfoBtn) {
        cancelPersonalInfoBtn.addEventListener('click', function () {
            // Restore original values
            personalInfoInputs.forEach(input => {
                if (input && originalValues[input.id]) {
                    input.value = originalValues[input.id];
                    input.disabled = true;
                }
            });

            personalInfoActions.style.display = 'none';
            editPersonalInfoBtn.style.display = 'flex';
        });
    }

    if (savePersonalInfoBtn) {
        savePersonalInfoBtn.addEventListener('click', function () {
            // Validate inputs
            let isValid = true;

            personalInfoInputs.forEach(input => {
                if (input && input.value.trim() === '') {
                    isValid = false;
                    input.style.borderColor = '#ff4444';
                } else if (input) {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });

            if (isValid) {
                // Simulate saving
                savePersonalInfoBtn.textContent = 'Saving...';
                savePersonalInfoBtn.disabled = true;

                setTimeout(() => {
                    personalInfoInputs.forEach(input => {
                        if (input) input.disabled = true;
                    });

                    personalInfoActions.style.display = 'none';
                    editPersonalInfoBtn.style.display = 'flex';
                    savePersonalInfoBtn.textContent = 'Save Changes';
                    savePersonalInfoBtn.disabled = false;

                    showNotification('Profile updated successfully!', 'success');
                }, 1000);
            } else {
                showNotification('Please fill in all fields', 'error');
            }
        });
    }

    // Avatar Edit Button
    const avatarEditBtn = document.querySelector('.avatar-edit-btn');
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', function () {
            showNotification('Avatar upload coming soon!', 'info');
        });
    }

    // Security Buttons
    const securityButtons = document.querySelectorAll('.security-item .btn-outline');
    securityButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const action = this.textContent.trim();
            showNotification(`${action} feature coming soon!`, 'info');
        });
    });

    // Toggle Switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function () {
            const label = this.closest('.preference-item').querySelector('h4').textContent;
            const status = this.checked ? 'enabled' : 'disabled';
            showNotification(`${label} ${status}`, 'success');
        });
    });

    // Danger Zone Buttons
    const deactivateBtn = document.querySelector('.btn-danger-outline');
    const deleteBtn = document.querySelector('.btn-danger');

    if (deactivateBtn) {
        deactivateBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to deactivate your account?')) {
                showNotification('Account deactivation initiated', 'warning');
            }
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to DELETE your account? This action cannot be undone!')) {
                if (confirm('Final warning: This will permanently delete all your data. Continue?')) {
                    showNotification('Account deletion initiated', 'error');
                }
            }
        });
    }

    // Notification System
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        const colors = {
            success: { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', text: '#22c55e' },
            error: { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#ef4444' },
            warning: { bg: 'rgba(249, 115, 22, 0.2)', border: '#f97316', text: '#f97316' },
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
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add hover effects to cards
    document.querySelectorAll('.profile-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    console.log('SIRIUM User Profile Page Loaded');
});