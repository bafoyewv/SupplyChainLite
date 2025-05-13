document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        // Redirect to dashboard if already logged in
        window.location.href = 'pages/dashboard.html';
    }

    // Get the current page
    const currentPage = window.location.pathname.split('/').pop();
    
    // Login form handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailValidation = document.getElementById('email-validation');
        const passwordValidation = document.getElementById('password-validation');
        const errorMessage = document.getElementById('error-message');
        const loadingIndicator = document.getElementById('loading');

        // Email validation function
        function validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        // Form validation
        function validateForm() {
            let isValid = true;
            
            // Reset validation messages
            emailValidation.textContent = '';
            passwordValidation.textContent = '';
            
            // Validate email
            if (!emailInput.value.trim()) {
                emailValidation.textContent = 'Email is required';
                isValid = false;
            } else if (!validateEmail(emailInput.value.trim())) {
                emailValidation.textContent = 'Please enter a valid email address';
                isValid = false;
            }
            
            // Validate password
            if (!passwordInput.value.trim()) {
                passwordValidation.textContent = 'Password is required';
                isValid = false;
            }
            
            return isValid;
        }

        // Handle form submission
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return;
            }
            
            // Show loading indicator
            loadingIndicator.style.display = 'block';
            errorMessage.style.display = 'none';
            
            // Prepare login data
            const loginData = {
                email: emailInput.value.trim(),
                password: passwordInput.value.trim()
            };
            
            // Send login request
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Invalid email or password');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Store auth token and user info
                localStorage.setItem('authToken', data.token);
                
                // If user data is returned, store it as well
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                
                // Redirect to dashboard
                window.location.href = 'pages/dashboard.html';
            })
            .catch(error => {
                // Display error message
                errorMessage.textContent = error.message || 'Invalid email or password';
                errorMessage.style.display = 'block';
                console.error('Login error:', error);
            })
            .finally(() => {
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
            });
        });
    }
    
    // Registration form handling
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const usernameValidation = document.getElementById('username-validation');
        const emailValidation = document.getElementById('email-validation');
        const passwordValidation = document.getElementById('password-validation');
        const confirmPasswordValidation = document.getElementById('confirm-password-validation');
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');
        const loadingIndicator = document.getElementById('loading');
        
        // Email validation function
        function validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        
        // Password strength validation
        function validatePasswordStrength(password) {
            // Password must be at least 8 characters long and contain at least one number and one letter
            const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            return re.test(password);
        }
        
        // Form validation
        function validateForm() {
            let isValid = true;
            
            // Reset validation messages
            usernameValidation.textContent = '';
            emailValidation.textContent = '';
            passwordValidation.textContent = '';
            confirmPasswordValidation.textContent = '';
            
            // Validate username
            if (!usernameInput.value.trim()) {
                usernameValidation.textContent = 'Username is required';
                isValid = false;
            }
            
            // Validate email
            if (!emailInput.value.trim()) {
                emailValidation.textContent = 'Email is required';
                isValid = false;
            } else if (!validateEmail(emailInput.value.trim())) {
                emailValidation.textContent = 'Please enter a valid email address';
                isValid = false;
            }
            
            // Validate password
            if (!passwordInput.value.trim()) {
                passwordValidation.textContent = 'Password is required';
                isValid = false;
            } else if (!validatePasswordStrength(passwordInput.value)) {
                passwordValidation.textContent = 'Password must be at least 8 characters long and contain at least one letter and one number';
                isValid = false;
            }
            
            // Validate confirm password
            if (!confirmPasswordInput.value.trim()) {
                confirmPasswordValidation.textContent = 'Please confirm your password';
                isValid = false;
            } else if (passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordValidation.textContent = 'Passwords do not match';
                isValid = false;
            }
            
            return isValid;
        }
        
        // Handle form submission
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return;
            }
            
            // Show loading indicator
            loadingIndicator.style.display = 'block';
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';
            
            // Prepare registration data
            const registerData = {
                username: usernameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value.trim()
            };
            
            // Send registration request
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Registration failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Show success message
                successMessage.textContent = 'Account created successfully! Redirecting to login page...';
                successMessage.style.display = 'block';
                
                // Reset form
                registerForm.reset();
                
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
            })
            .catch(error => {
                // Display error message
                errorMessage.textContent = error.message || 'Failed to create account. Please try again.';
                errorMessage.style.display = 'block';
                console.error('Registration error:', error);
            })
            .finally(() => {
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
            });
        });
    }
});