document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productsTable = document.getElementById('products-table');
    const productsList = document.getElementById('products-list');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const noProductsMessage = document.getElementById('no-products');
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');
    const closeModal = document.querySelector('.close-modal');
    const productDetails = document.getElementById('product-details');
    
    // Load products when page loads
    loadProducts();
    
    // Event Listeners
    addProductBtn.addEventListener('click', function() {
        window.location.href = 'add-product.html';
    });
    
    closeModal.addEventListener('click', function() {
        productModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === productModal) {
            productModal.style.display = 'none';
        }
    });
    
    // Functions
    function loadProducts() {
        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        errorMessage.style.display = 'none';
        productsTable.style.display = 'none';
        noProductsMessage.style.display = 'none';
        
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Fetch products from API
        fetch('/api/products', {
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
        .then(products => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Check if products exist
            if (products && products.length > 0) {
                displayProducts(products);
                productsTable.style.display = 'table';
            } else {
                noProductsMessage.style.display = 'block';
            }
        })
        .catch(error => {
            // Hide loading indicator and show error
            loadingIndicator.style.display = 'none';
            errorMessage.textContent = `Failed to load products: ${error.message}`;
            errorMessage.style.display = 'block';
            console.error('Error loading products:', error);
        });
    }
    
    function displayProducts(products) {
        // Clear existing products
        productsList.innerHTML = '';
        
        // Add each product to the table
        products.forEach(product => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${truncateText(product.description, 50)}</td>
                <td>$${parseFloat(product.price).toFixed(2)}</td>
                <td>${product.category || 'N/A'}</td>
                <td class="action-buttons">
                    <button class="view-btn" data-id="${product.id}">View</button>
                    <button class="edit-btn" data-id="${product.id}">Edit</button>
                    <button class="delete-btn" data-id="${product.id}">Delete</button>
                </td>
            `;
            
            productsList.appendChild(row);
        });
        
        // Add event listeners to action buttons
        addActionButtonListeners();
    }
    
    function addActionButtonListeners() {
        // View button listeners
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                viewProductDetails(productId);
            });
        });
        
        // Edit button listeners
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                window.location.href = `edit-product.html?id=${productId}`;
            });
        });
        
        // Delete button listeners
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                confirmDeleteProduct(productId);
            });
        });
    }
    
    function viewProductDetails(productId) {
        // Show loading in modal
        productDetails.innerHTML = '<div class="spinner"></div>';
        productModal.style.display = 'block';
        
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Fetch product details
        fetch(`/api/products/${productId}`, {
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
        .then(product => {
            // Display product details in modal
            productDetails.innerHTML = `
                <div class="product-detail-row">
                    <div class="detail-label">ID:</div>
                    <div class="detail-value">${product.id}</div>
                </div>
                <div class="product-detail-row">
                    <div class="detail-label">Name:</div>
                    <div class="detail-value">${product.name}</div>
                </div>
                <div class="product-detail-row">
                    <div class="detail-label">Description:</div>
                    <div class="detail-value">${product.description}</div>
                </div>
                <div class="product-detail-row">
                    <div class="detail-label">Price:</div>
                    <div class="detail-value">$${parseFloat(product.price).toFixed(2)}</div>
                </div>
                <div class="product-detail-row">
                    <div class="detail-label">Category:</div>
                    <div class="detail-value">${product.category || 'N/A'}</div>
                </div>
                <div class="product-detail-row">
                    <div class="detail-label">SKU:</div>
                    <div class="detail-value">${product.sku || 'N/A'}</div>
                </div>
                <div class="product-detail-row">
                    <div class="detail-label">Created:</div>
                    <div class="detail-value">${formatDate(product.createdAt)}</div>
                </div>
                <div class="product-detail-row">
                    <div class="detail-label">Updated:</div>
                    <div class="detail-value">${formatDate(product.updatedAt)}</div>
                </div>
            `;
        })
        .catch(error => {
            productDetails.innerHTML = `<div class="error-message">Error loading product details: ${error.message}</div>`;
            console.error('Error loading product details:', error);
        });
    }
    
    function confirmDeleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            deleteProduct(productId);
        }
    }
    
    function deleteProduct(productId) {
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Delete product via API
        fetch(`/api/products/${productId}`, {
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
        .then(() => {
            // Reload products after successful deletion
            loadProducts();
            
            // Show success message
            errorMessage.textContent = 'Product deleted successfully.';
            errorMessage.style.backgroundColor = '#d4edda';
            errorMessage.style.color = '#155724';
            errorMessage.style.display = 'block';
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                errorMessage.style.display = 'none';
                errorMessage.style.backgroundColor = '#ffecec';
                errorMessage.style.color = '#e74c3c';
            }, 3000);
        })
        .catch(error => {
            // Show error message
            errorMessage.textContent = `Failed to delete product: ${error.message}`;
            errorMessage.style.display = 'block';
            console.error('Error deleting product:', error);
        });
    }
    
    // Helper Functions
    function truncateText(text, maxLength) {
        if (!text) return 'N/A';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
});