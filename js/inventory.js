document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const inventoryTable = document.getElementById('inventory-table');
    const inventoryList = document.getElementById('inventory-list');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const noInventoryMessage = document.getElementById('no-inventory');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const updateModal = document.getElementById('update-modal');
    const closeModal = document.querySelector('.close-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const updateInventoryForm = document.getElementById('update-inventory-form');
    const productIdInput = document.getElementById('product-id');
    const productNameDisplay = document.getElementById('product-name-display');
    const currentQuantityInput = document.getElementById('current-quantity');
    const newQuantityInput = document.getElementById('new-quantity');
    const quantityValidation = document.getElementById('quantity-validation');
    
    // Load inventory when page loads
    loadInventory();
    
    // Event Listeners
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filterInventory(searchTerm);
    });
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim().toLowerCase();
            filterInventory(searchTerm);
        }
    });
    
    refreshBtn.addEventListener('click', loadInventory);
    
    closeModal.addEventListener('click', function() {
        updateModal.style.display = 'none';
    });
    
    closeModalBtn.addEventListener('click', function() {
        updateModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === updateModal) {
            updateModal.style.display = 'none';
        }
    });
    
    updateInventoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateInventory();
    });
    
    // Functions
    function loadInventory() {
        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        inventoryTable.style.display = 'none';
        noInventoryMessage.style.display = 'none';
        
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Fetch inventory from API
        fetch('/api/inventory', {
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
        .then(inventory => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Check if inventory exists
            if (inventory && inventory.length > 0) {
                displayInventory(inventory);
                inventoryTable.style.display = 'table';
            } else {
                noInventoryMessage.style.display = 'block';
            }
        })
        .catch(error => {
            // Hide loading indicator and show error
            loadingIndicator.style.display = 'none';
            errorMessage.textContent = `Failed to load inventory: ${error.message}`;
            errorMessage.style.display = 'block';
            console.error('Error loading inventory:', error);
        });
    }
    
    function displayInventory(inventory) {
        // Clear existing inventory
        inventoryList.innerHTML = '';
        
        // Add each product to the table
        inventory.forEach(item => {
            const row = document.createElement('tr');
            
            // Determine stock status
            let statusClass = 'status-in-stock';
            let statusText = 'In Stock';
            
            if (item.quantity <= 0) {
                statusClass = 'status-out-of-stock';
                statusText = 'Out of Stock';
            } else if (item.quantity < 10) {
                statusClass = 'status-low-stock';
                statusText = 'Low Stock';
            }
            
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td><span class="status-indicator ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="update-btn" data-id="${item.id}" data-name="${item.name}" data-quantity="${item.quantity}">
                        Update Stock
                    </button>
                </td>
            `;
            
            inventoryList.appendChild(row);
        });
        
        // Add event listeners to update buttons
        addUpdateButtonListeners();
    }
    
    function addUpdateButtonListeners() {
        const updateButtons = document.querySelectorAll('.update-btn');
        updateButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const productName = this.getAttribute('data-name');
                const currentQuantity = this.getAttribute('data-quantity');
                
                // Populate modal with product data
                productIdInput.value = productId;
                productNameDisplay.value = productName;
                currentQuantityInput.value = currentQuantity;
                newQuantityInput.value = currentQuantity;
                quantityValidation.textContent = '';
                
                // Show modal
                updateModal.style.display = 'block';
            });
        });
    }
    
    function updateInventory() {
        // Validate new quantity
        if (!validateQuantity()) {
            return;
        }
        
        // Get form data
        const productId = productIdInput.value;
        const newQuantity = parseInt(newQuantityInput.value);
        
        // Prepare update data
        const updateData = {
            id: parseInt(productId),
            quantity: newQuantity
        };
        
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Show loading and hide messages
        loadingIndicator.style.display = 'flex';
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        
        // Update inventory via API
        fetch(`/api/inventory/${productId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
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
            successMessage.style.display = 'block';
            
            // Hide modal
            updateModal.style.display = 'none';
            
            // Reload inventory
            loadInventory();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        })
        .catch(error => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Show error message
            errorMessage.textContent = `Failed to update inventory: ${error.message}`;
            errorMessage.style.display = 'block';
            console.error('Error updating inventory:', error);
        });
    }
    
    function validateQuantity() {
        // Reset validation message
        quantityValidation.textContent = '';
        
        // Get new quantity
        const newQuantity = newQuantityInput.value;
        
        // Check if quantity is empty
        if (!newQuantity) {
            quantityValidation.textContent = 'New quantity is required';
            return false;
        }
        
        // Check if quantity is a valid number
        if (isNaN(newQuantity) || parseInt(newQuantity) < 0) {
            quantityValidation.textContent = 'Quantity must be a non-negative number';
            return false;
        }
        
        return true;
    }
    
    function filterInventory(searchTerm) {
        // Get all rows
        const rows = inventoryList.querySelectorAll('tr');
        
        // If search term is empty, show all rows
        if (!searchTerm) {
            rows.forEach(row => {
                row.style.display = '';
            });
            return;
        }
        
        // Filter rows based on search term
        rows.forEach(row => {
            const productName = row.cells[1].textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
});