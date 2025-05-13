document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const suppliersTable = document.getElementById('suppliers-table');
    const suppliersList = document.getElementById('suppliers-list');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const noSuppliersMessage = document.getElementById('no-suppliers');
    const addSupplierBtn = document.getElementById('add-supplier-btn');
    const supplierModal = document.getElementById('supplier-modal');
    const viewSupplierModal = document.getElementById('view-supplier-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const addSupplierForm = document.getElementById('add-supplier-form');
    const supplierDetails = document.getElementById('supplier-details');
    
    // Form validation elements
    const nameValidation = document.getElementById('name-validation');
    const emailValidation = document.getElementById('email-validation');
    const phoneValidation = document.getElementById('phone-validation');
    
    // Load suppliers when page loads
    loadSuppliers();
    
    // Event Listeners
    addSupplierBtn.addEventListener('click', function() {
        // Reset form and validation messages
        addSupplierForm.reset();
        resetValidationMessages();
        
        // Show modal
        supplierModal.style.display = 'block';
    });
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            supplierModal.style.display = 'none';
            viewSupplierModal.style.display = 'none';
        });
    });
    
    closeModalBtn.addEventListener('click', function() {
        supplierModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === supplierModal) {
            supplierModal.style.display = 'none';
        }
        if (event.target === viewSupplierModal) {
            viewSupplierModal.style.display = 'none';
        }
    });
    
    addSupplierForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const supplierData = {
            name: document.getElementById('supplier-name').value.trim(),
            contact: {
                email: document.getElementById('supplier-email').value.trim(),
                phone: document.getElementById('supplier-phone').value.trim()
            }
        };
        
        // Add supplier
        addSupplier(supplierData);
    });
    
    // Functions
    function loadSuppliers() {
        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        suppliersTable.style.display = 'none';
        noSuppliersMessage.style.display = 'none';
        
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Fetch suppliers from API
        fetch('/api/suppliers', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(suppliers => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Check if suppliers exist
            if (suppliers && suppliers.length > 0) {
                displaySuppliers(suppliers);
                suppliersTable.style.display = 'table';
            } else {
                noSuppliersMessage.style.display = 'block';
            }
        })
        .catch(error => {
            // Hide loading indicator and show error
            loadingIndicator.style.display = 'none';
            errorMessage.textContent = `Failed to load suppliers: ${error.message}`;
            errorMessage.style.display = 'block';
            console.error('Error loading suppliers:', error);
        });
    }
    
    function displaySuppliers(suppliers) {
        // Clear existing suppliers
        suppliersList.innerHTML = '';
        
        // Add each supplier to the table
        suppliers.forEach(supplier => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${supplier.name}</td>
                <td>${supplier.contact.email || 'N/A'}</td>
                <td>${supplier.contact.phone || 'N/A'}</td>
                <td class="action-buttons">
                    <button class="view-btn" data-id="${supplier.id}">View</button>
                    <button class="edit-btn" data-id="${supplier.id}">Edit</button>
                    <button class="delete-btn" data-id="${supplier.id}">Delete</button>
                </td>
            `;
            
            suppliersList.appendChild(row);
        });
        
        // Add event listeners to action buttons
        addActionButtonListeners();
    }
    
    function addActionButtonListeners() {
        // View button listeners
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const supplierId = this.getAttribute('data-id');
                viewSupplierDetails(supplierId);
            });
        });
        
        // Edit button listeners
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const supplierId = this.getAttribute('data-id');
                editSupplier(supplierId);
            });
        });
        
        // Delete button listeners
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const supplierId = this.getAttribute('data-id');
                confirmDeleteSupplier(supplierId);
            });
        });
    }
    
    function viewSupplierDetails(supplierId) {
        // Show loading in modal
        supplierDetails.innerHTML = '<div class="spinner"></div>';
        viewSupplierModal.style.display = 'block';
        
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Fetch supplier details
        fetch(`/api/suppliers/${supplierId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(supplier => {
            // Display supplier details in modal
            supplierDetails.innerHTML = `
                <div class="supplier-detail-row">
                    <div class="detail-label">Name:</div>
                    <div class="detail-value">${supplier.name}</div>
                </div>
                <div class="supplier-detail-row">
                    <div class="detail-label">Email:</div>
                    <div class="detail-value">${supplier.contact.email || 'N/A'}</div>
                </div>
                <div class="supplier-detail-row">
                    <div class="detail-label">Phone:</div>
                    <div class="detail-value">${supplier.contact.phone || 'N/A'}</div>
                </div>
                <div class="supplier-detail-row">
                    <div class="detail-label">Created:</div>
                    <div class="detail-value">${formatDate(supplier.createdAt)}</div>
                </div>
                <div class="supplier-detail-row">
                    <div class="detail-label">Updated:</div>
                    <div class="detail-value">${formatDate(supplier.updatedAt)}</div>
                </div>
            `;
        })
        .catch(error => {
            supplierDetails.innerHTML = `<div class="error-message">Error loading supplier details: ${error.message}</div>`;
            console.error('Error loading supplier details:', error);
        });
    }
    
    function editSupplier(supplierId) {
        // Redirect to edit page or implement in-place editing
        console.log(`Edit supplier with ID: ${supplierId}`);
        // For now, we'll just log this action
        // In a real implementation, you might redirect to an edit page or show an edit modal
    }
    
    function confirmDeleteSupplier(supplierId) {
        if (confirm('Are you sure you want to delete this supplier? This action cannot be undone.')) {
            deleteSupplier(supplierId);
        }
    }
    
    function deleteSupplier(supplierId) {
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        
        // Delete supplier via API
        fetch(`/api/suppliers/${supplierId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Show success message
            successMessage.textContent = 'Supplier deleted successfully!';
            successMessage.style.display = 'block';
            
            // Reload suppliers
            loadSuppliers();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        })
        .catch(error => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Show error message
            errorMessage.textContent = `Failed to delete supplier: ${error.message}`;
            errorMessage.style.display = 'block';
            console.error('Error deleting supplier:', error);
        });
    }
    
    function addSupplier(supplierData) {
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        
        // Add supplier via API
        fetch('/api/suppliers', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(supplierData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || `HTTP error! Status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Show success message
            successMessage.textContent = 'Supplier added successfully!';
            successMessage.style.display = 'block';
            
            // Hide modal
            supplierModal.style.display = 'none';
            
            // Reset form
            addSupplierForm.reset();
            
            // Reload suppliers
            loadSuppliers();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        })
        .catch(error => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Show error message
            errorMessage.textContent = `Failed to add supplier: ${error.message}`;
            errorMessage.style.display = 'block';
            console.error('Error adding supplier:', error);
        });
    }
    
    function validateForm() {
        let isValid = true;
        
        // Reset validation messages
        resetValidationMessages();
        
        // Validate supplier name
        const supplierName = document.getElementById('supplier-name').value.trim();
        if (!supplierName) {
            nameValidation.textContent = 'Supplier name is required';
            isValid = false;
        }
        
        // Validate email
        const email = document.getElementById('supplier-email').value.trim();
        if (!email) {
            emailValidation.textContent = 'Email is required';
            isValid = false;
        } else if (!validateEmail(email)) {
            emailValidation.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Validate phone
        const phone = document.getElementById('supplier-phone').value.trim();
        if (!phone) {
            phoneValidation.textContent = 'Phone number is required';
            isValid = false;
        }
        
        return isValid;
    }
    
    function resetValidationMessages() {
        nameValidation.textContent = '';
        emailValidation.textContent = '';
        phoneValidation.textContent = '';
    }
    
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        return date.toLocaleString();
    }
});