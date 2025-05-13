document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addProductForm = document.getElementById('add-product-form');
    const productNameInput = document.getElementById('product-name');
    const productDescriptionInput = document.getElementById('product-description');
    const productPriceInput = document.getElementById('product-price');
    const productQuantityInput = document.getElementById('product-quantity');
    const supplierNameInput = document.getElementById('supplier-name');
    const nameValidation = document.getElementById('name-validation');
    const priceValidation = document.getElementById('price-validation');
    const quantityValidation = document.getElementById('quantity-validation');
    const supplierValidation = document.getElementById('supplier-validation');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const loadingIndicator = document.getElementById('loading');
    const backBtn = document.getElementById('back-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    
    // Event Listeners
    addProductForm.addEventListener('submit', handleFormSubmit);
    backBtn.addEventListener('click', navigateToProducts);
    cancelBtn.addEventListener('click', navigateToProducts);
    
    // Form validation and submission
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
        
        // Get form data
        const productData = {
            name: productNameInput.value.trim(),
            description: productDescriptionInput.value.trim(),
            price: parseFloat(productPriceInput.value),
            quantity: parseInt(productQuantityInput.value),
            supplierName: supplierNameInput.value.trim()
        };
        
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Submit form data to API
        fetch('/api/products', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
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
            addProductForm.reset();
            
            // Redirect to products page after 2 seconds
            setTimeout(() => {
                navigateToProducts();
            }, 2000);
        })
        .catch(error => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Show error message
            errorMessage.textContent = `Failed to add product: ${error.message}`;
            errorMessage.style.display = 'block';
            console.error('Error adding product:', error);
        });
    }
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Validate product name
        if (!productNameInput.value.trim()) {
            nameValidation.textContent = 'Product name is required';
            isValid = false;
        }
        
        // Validate price
        if (!productPriceInput.value) {
            priceValidation.textContent = 'Price is required';
            isValid = false;
        } else if (parseFloat(productPriceInput.value) < 0) {
            priceValidation.textContent = 'Price cannot be negative';
            isValid = false;
        }
        
        // Validate quantity
        if (!productQuantityInput.value) {
            quantityValidation.textContent = 'Quantity is required';
            isValid = false;
        } else if (parseInt(productQuantityInput.value) < 0) {
            quantityValidation.textContent = 'Quantity cannot be negative';
            isValid = false;
        }
        
        // Validate supplier name
        if (!supplierNameInput.value.trim()) {
            supplierValidation.textContent = 'Supplier name is required';
            isValid = false;
        }
        
        return isValid;
    }
    
    // Reset validation messages
    function resetValidationMessages() {
        nameValidation.textContent = '';
        priceValidation.textContent = '';
        quantityValidation.textContent = '';
        supplierValidation.textContent = '';
    }
    
    // Navigate to products page
    function navigateToProducts() {
        window.location.href = 'products.html';
    }
});