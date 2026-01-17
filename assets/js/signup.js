// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // DOM Elements
    const signupForm = document.getElementById('signupForm');
    const inputs = document.querySelectorAll('.input-group input');

    // Input Event Listeners
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            if (this.value.trim() !== '') {
                validateField(this);
            }
        });

        input.addEventListener('input', function () {
            const inputGroup = this.parentElement;
            if (inputGroup.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Validation Functions
    function validateField(input) {
        const inputGroup = input.parentElement;
        const value = input.value.trim();
        let isValid = true;
        let errorMsg = '';

        // Remove previous error message
        const existingError = inputGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        switch (input.id) {
            case 'fullName':
                if (value.length < 2) {
                    isValid = false;
                    errorMsg = 'Name must be at least 2 characters';
                }
                break;

            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    isValid = false;
                    errorMsg = 'Please enter a valid email address';
                }
                break;

            case 'password':
                if (value.length < 6) {
                    isValid = false;
                    errorMsg = 'Password must be at least 6 characters';
                }

                // Revalidate confirm password if it has a value
                const confirmPasswordInput = document.getElementById('confirmPassword');
                if (confirmPasswordInput && confirmPasswordInput.value) {
                    validateField(confirmPasswordInput);
                }
                break;

            case 'confirmPassword':
                const passwordInput = document.getElementById('password');
                if (passwordInput && value !== passwordInput.value) {
                    isValid = false;
                    errorMsg = 'Passwords do not match';
                }
                break;
        }

        if (isValid) {
            inputGroup.classList.remove('error');
        } else {
            inputGroup.classList.add('error');

            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMsg;
            inputGroup.appendChild(errorElement);
        }

        return isValid;
    }

    // Form Submission
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isFormValid = true;

            // Validate all fields
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                const submitButton = this.querySelector('.btn-primary');
                submitButton.classList.add('loading');
                submitButton.textContent = 'Creating Account...';

                // Simulate API call
                setTimeout(() => {
                    submitButton.classList.remove('loading');
                    submitButton.textContent = 'Sign Up';


                    window.location.href = 'dashboard.html';

                    // Reset form
                    signupForm.reset();
                    document.querySelectorAll('.input-group').forEach(group => {
                        group.classList.remove('error');
                    });

                }, 1500);
            }
        });
    }

    // Enter key navigation
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && index < inputs.length - 1) {
                e.preventDefault();
                inputs[index + 1].focus();
            }
        });
    });

    console.log('SIRIUM Sign Up Page Loaded');
});