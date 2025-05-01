// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Login button functionality
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            showLoginModal();
        });
    }

    // Register button functionality
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            showRegisterModal();
        });
    }

    // Function to show login modal
    function showLoginModal() {
        const modalHtml = `
            <div class="modal fade" id="loginModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Login</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="loginForm">
                                <div class="mb-3">
                                    <label for="loginEmail" class="form-label">Email address</label>
                                    <input type="email" class="form-control" id="loginEmail" required>
                                </div>
                                <div class="mb-3">
                                    <label for="loginPassword" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="loginPassword" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Initialize modal
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();

        // Handle form submission
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Here you would typically make an API call to your backend
            console.log('Login attempt:', { email, password });
            
            // For demo purposes, just close the modal
            loginModal.hide();
        });

        // Remove modal from DOM when hidden
        document.getElementById('loginModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    // Function to show register modal
    function showRegisterModal() {
        const modalHtml = `
            <div class="modal fade" id="registerModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Register</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="registerForm">
                                <div class="mb-3">
                                    <label for="registerName" class="form-label">Full Name</label>
                                    <input type="text" class="form-control" id="registerName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="registerEmail" class="form-label">Email address</label>
                                    <input type="email" class="form-control" id="registerEmail" required>
                                </div>
                                <div class="mb-3">
                                    <label for="registerPassword" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="registerPassword" required>
                                </div>
                                <div class="mb-3">
                                    <label for="registerConfirmPassword" class="form-label">Confirm Password</label>
                                    <input type="password" class="form-control" id="registerConfirmPassword" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Initialize modal
        const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
        registerModal.show();

        // Handle form submission
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Here you would typically make an API call to your backend
            console.log('Registration attempt:', { name, email, password });
            
            // For demo purposes, just close the modal
            registerModal.hide();
        });

        // Remove modal from DOM when hidden
        document.getElementById('registerModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 