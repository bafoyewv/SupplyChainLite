document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const createOrderForm = document.getElementById('create-order-form');
    const orderItems = document.getElementById('order-items');
    const addItemBtn = document.getElementById('add-item-btn');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const backBtn = document.getElementById('back-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    
    // Global variables
    let products = [];
    let itemCount = 1;
    
    // Load products when page loads
    loadProducts();
    
    // Event Listeners
    addItemBtn.addEventListener('click', addOrderItem);
    createOrderForm.addEventListener('submit', handleFormSubmit);
    backBtn.addEventListener('click', navigateToOrders);
    cancelBtn.addEventListener('click', navigateToOrders);
    
    // Functions
    function loadProducts() {
        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        
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
        .then(data => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Store products globally
            products = data;
            
            // Populate product dropdowns
            populateProductDropdowns();
            
            // Add event listeners to the first item
            addItemEventListeners(0);
        })
        .catch(error => {
            // Hide loading indicator and show error
            loadingIndicator.style.display = 'none';
            errorMessage.textContent = `Failed to load products: ${error.message}`;
            errorMessage.style.display = 'block';
            console.error('Error loading products:', error);
        });
    }
    
    function populateProductDropdowns() {
        const productSelects = document.querySelectorAll('.product-select');
        
        productSelects.forEach(select => {
            // Clear existing options except the first one
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // Add product options
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} - $${parseFloat(product.price).toFixed(2)}`;
                option.dataset.price = product.price;
                option.dataset.name = product.name;
                select.appendChild(option);
            });
        });
    }
    
    function addOrderItem() {
        const index = itemCount;
        itemCount++;
        
        const newItem = document.createElement('div');
        newItem.className = 'order-item';
        newItem.dataset.index = index;
        
        newItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="product-${index}">Product *</label>
                    <select id="product-${index}" name="product" class="product-select" required>
                        <option value="">Select a product</option>
                        <!-- Products will be loaded here dynamically -->
                    </select>
                    <span class="validation-message" id="product-validation-${index}"></span>
                </div>
                
                <div class="form-group">
                    <label for="quantity-${index}">Quantity *</label>
                    <input type="number" id="quantity-${index}" name="quantity" class="quantity-input" min="1" value="1" required>
                    <span class="validation-message" id="quantity-validation-${index}"></span>
                </div>
                
                <div class="form-group">
                    <label for="price-${index}">Unit Price</label>
                    <input type="text" id="price-${index}" name="price" class="price-input" readonly>
                </div>
                
                <div class="form-group">
                    <label for="subtotal-${index}">Subtotal</label>
                    <input type="text" id="subtotal-${index}" name="subtotal" class="subtotal-input" readonly>
                </div>
                
                <div class="form-group item-actions">
                    <button type="button" class="remove-item-btn" title="Remove Item">×</button>
                </div>
            </div>
        `;
        
        orderItems.appendChild(newItem);
        
        // Populate product dropdown
        populateProductDropdowns();
        
        // Add event listeners to the new item
        addItemEventListeners(index);
        
        // Update total items
        updateTotalItems();
    }
    
    function addItemEventListeners(index) {
        const productSelect = document.getElementById(`product-${index}`);
        const quantityInput = document.getElementById(`quantity-${index}`);
        const priceInput = document.getElementById(`price-${index}`);
        const subtotalInput = document.getElementById(`subtotal-${index}`);
        const removeBtn = document.querySelector(`.order-item[data-index="${index}"] .remove-item-btn`);
        
        // Product select change event
        productSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const price = selectedOption.dataset.price || 0;
            
            // Update price input
            priceInput.value = price ? `$${parseFloat(price).toFixed(2)}` : '';
            
            // Update subtotal
            updateSubtotal(index);
            
            // Update total price
            updateTotalPrice();
        });
        
        // Quantity input change event
        quantityInput.addEventListener('input', function() {
            // Update subtotal
            updateSubtotal(index);
            
            // Update total price
            updateTotalPrice();
        });
        
        // Remove button click event
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                const orderItem = document.querySelector(`.order-item[data-index="${index}"]`);
                
                // Only allow removal if there's more than one item
                if (document.querySelectorAll('.order-item').length > 1) {
                    orderItem.remove();
                    
                    // Update total items
                    updateTotalItems();
                    
                    // Update total price
                    updateTotalPrice();
                } else {
                    alert('You must have at least one item in the order.');
                }
            });
        }
    }
    
    function updateSubtotal(index) {
        const productSelect = document.getElementById(`product-${index}`);
        const quantityInput = document.getElementById(`quantity-${index}`);
        const subtotalInput = document.getElementById(`subtotal-${index}`);
        
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        const price = selectedOption.dataset.price || 0;
        const quantity = parseInt(quantityInput.value) || 0;
        
        const subtotal = price * quantity;
        subtotalInput.value = subtotal ? `$${subtotal.toFixed(2)}` : '';
    }
    
    function updateTotalItems() {
        const itemCount = document.querySelectorAll('.order-item').length;
        totalItemsElement.textContent = itemCount;
    }
    
    function updateTotalPrice() {
        let totalPrice = 0;
        
        document.querySelectorAll('.order-item').forEach(item => {
            const index = item.dataset.index;
            const productSelect = document.getElementById(`product-${index}`);
            const quantityInput = document.getElementById(`quantity-${index}`);
            
            const selectedOption = productSelect.options[productSelect.selectedIndex];
            const price = parseFloat(selectedOption.dataset.price) || 0;
            const quantity = parseInt(quantityInput.value) || 0;
            
            totalPrice += price * quantity;
        });
        
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Reset validation messages
        resetValidationMessages();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading indicator and hide messages
        loadingIndicator.style.display = 'flex';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Get order data
        const orderData = getOrderData();
        
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Submit order to API
        fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
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
            
            // Reset form
            createOrderForm.reset();
            
            // Redirect to orders page after 2 seconds
            setTimeout(() => {
                navigateToOrders();
            }, 2000);
        })
        .catch(error => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Show error message
            errorMessage.textContent = `Failed to create order: ${error.message}`;
            errorMessage.style.display = 'block';
            console.error('Error creating order:', error);
        });
    }
    
    function getOrderData() {
        const orderItems = [];
        let totalPrice = 0;
        
        document.querySelectorAll('.order-item').forEach(item => {
            const index = item.dataset.index;
            const productSelect = document.getElementById(`product-${index}`);
            const quantityInput = document.getElementById(`quantity-${index}`);
            
            const productId = productSelect.value;
            const selectedOption = productSelect.options[productSelect.selectedIndex];
            const productName = selectedOption.dataset.name;
            const price = parseFloat(selectedOption.dataset.price);
            const quantity = parseInt(quantityInput.value);
            
            const subtotal = price * quantity;
            totalPrice += subtotal;
            
            orderItems.push({
                productId: parseInt(productId),
                productName: productName,
                quantity: quantity,
                price: price
            });
        });
        
        return {
            items: orderItems,
            totalPrice: totalPrice,
            status: 'Pending'
        };
    }
    
    function validateForm() {
        let isValid = true;
        
        document.querySelectorAll('.order-item').forEach(item => {
            const index = item.dataset.index;
            const productSelect = document.getElementById(`product-${index}`);
            const quantityInput = document.getElementById(`quantity-${index}`);
            const productValidation = document.getElementById(`product-validation-${index}`);
            const quantityValidation = document.getElementById(`quantity-validation-${index}`);
            
            // Validate product
            if (!productSelect.value) {
                productValidation.textContent = 'Please select a product';
                isValid = false;
            }
            
            // Validate quantity
            if (!quantityInput.value) {
                quantityValidation.textContent = 'Quantity is required';
                isValid = false;
            } else if (parseInt(quantityInput.value) < 1) {
                quantityValidation.textContent = 'Quantity must be at least 1';
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function resetValidationMessages() {
        document.querySelectorAll('.validation-message').forEach(message => {
            message.textContent = '';
        });
    }
    
    function navigateToOrders() {
        window.location.href = 'orders.html';
    }
});