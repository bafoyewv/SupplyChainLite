document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const ordersTable = document.getElementById('orders-table');
    const ordersList = document.getElementById('orders-list');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const noOrdersMessage = document.getElementById('no-orders');
    const createOrderBtn = document.getElementById('create-order-btn');
    const orderModal = document.getElementById('order-modal');
    const closeModal = document.querySelector('.close-modal');
    const orderDetails = document.getElementById('order-details');
    
    // Load orders when page loads
    loadOrders();
    
    // Event Listeners
    createOrderBtn.addEventListener('click', function() {
        window.location.href = 'create-order.html';
    });
    
    closeModal.addEventListener('click', function() {
        orderModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            orderModal.style.display = 'none';
        }
    });
    
    // Functions
    function loadOrders() {
        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        ordersTable.style.display = 'none';
        noOrdersMessage.style.display = 'none';
        
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Fetch orders from API
        fetch('/api/orders', {
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
        .then(orders => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Check if orders exist
            if (orders && orders.length > 0) {
                displayOrders(orders);
                ordersTable.style.display = 'table';
            } else {
                noOrdersMessage.style.display = 'block';
            }
        })
        .catch(error => {
            // Hide loading indicator and show error
            loadingIndicator.style.display = 'none';
            errorMessage.textContent = `Failed to load orders: ${error.message}`;
            errorMessage.style.display = 'block';
            console.error('Error loading orders:', error);
        });
    }
    
    function displayOrders(orders) {
        // Clear existing orders
        ordersList.innerHTML = '';
        
        // Add each order to the table
        orders.forEach(order => {
            const row = document.createElement('tr');
            
            // Format product names
            let productNames = 'N/A';
            if (order.products && order.products.length > 0) {
                productNames = order.products.map(p => p.name).join(', ');
                if (productNames.length > 30) {
                    productNames = productNames.substring(0, 30) + '...';
                }
            }
            
            // Calculate total quantity
            let totalQuantity = 0;
            if (order.products && order.products.length > 0) {
                totalQuantity = order.products.reduce((sum, product) => sum + product.quantity, 0);
            }
            
            // Format status
            const statusClass = order.status === 'Completed' ? 'status-completed' : 'status-pending';
            
            row.innerHTML = `
                <td>${order.id}</td>
                <td title="${order.products ? order.products.map(p => p.name).join(', ') : 'N/A'}">${productNames}</td>
                <td>${totalQuantity}</td>
                <td>$${parseFloat(order.totalPrice).toFixed(2)}</td>
                <td>${formatDate(order.orderDate)}</td>
                <td><span class="status-indicator ${statusClass}">${order.status}</span></td>
                <td class="action-buttons">
                    <button class="view-btn" data-id="${order.id}">View</button>
                    <button class="edit-btn" data-id="${order.id}">Edit</button>
                    <button class="delete-btn" data-id="${order.id}">Delete</button>
                </td>
            `;
            
            ordersList.appendChild(row);
        });
        
        // Add event listeners to action buttons
        addActionButtonListeners();
    }
    
    function addActionButtonListeners() {
        // View button listeners
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                viewOrderDetails(orderId);
            });
        });
        
        // Edit button listeners
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                window.location.href = `edit-order.html?id=${orderId}`;
            });
        });
        
        // Delete button listeners
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                confirmDeleteOrder(orderId);
            });
        });
    }
    
    function viewOrderDetails(orderId) {
        // Show loading in modal
        orderDetails.innerHTML = '<div class="spinner"></div>';
        orderModal.style.display = 'block';
        
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Fetch order details
        fetch(`/api/orders/${orderId}`, {
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
        .then(order => {
            // Get order details
            fetch(`/api/order-details/${orderId}`, {
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
            .then(orderItems => {
                // Display order details in modal
                let orderItemsHtml = '';
                
                if (orderItems && orderItems.length > 0) {
                    orderItemsHtml = `
                        <div class="order-items">
                            <h4>Order Items</h4>
                            <table class="order-items-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                    `;
                    
                    orderItems.forEach(item => {
                        const subtotal = item.quantity * item.price;
                        orderItemsHtml += `
                            <tr>
                                <td>${item.productName}</td>
                                <td>${item.quantity}</td>
                                <td>$${parseFloat(item.price).toFixed(2)}</td>
                                <td>$${parseFloat(subtotal).toFixed(2)}</td>
                            </tr>
                        `;
                    });
                    
                    orderItemsHtml += `
                                </tbody>
                            </table>
                        </div>
                    `;
                }
                
                orderDetails.innerHTML = `
                    <div class="order-detail-row">
                        <div class="detail-label">Order ID:</div>
                        <div class="detail-value">${order.id}</div>
                    </div>
                    <div class="order-detail-row">
                        <div class="detail-label">Customer:</div>
                        <div class="detail-value">${order.customerName || 'N/A'}</div>
                    </div>
                    <div class="order-detail-row">
                        <div class="detail-label">Order Date:</div>
                        <div class="detail-value">${formatDate(order.orderDate)}</div>
                    </div>
                    <div class="order-detail-row">
                        <div class="detail-label">Status:</div>
                        <div class="detail-value">
                            <span class="status-indicator ${order.status === 'Completed' ? 'status-completed' : 'status-pending'}">
                                ${order.status}
                            </span>
                        </div>
                    </div>
                    <div class="order-detail-row">
                        <div class="detail-label">Total Price:</div>
                        <div class="detail-value">$${parseFloat(order.totalPrice).toFixed(2)}</div>
                    </div>
                    ${orderItemsHtml}
                `;
            })
            .catch(error => {
                console.error('Error loading order items:', error);
                // Still display basic order details even if items fail to load
                orderDetails.innerHTML = `
                    <div class="order-detail-row">
                        <div class="detail-label">Order ID:</div>
                        <div class="detail-value">${order.id}</div>
                    </div>
                    <div class="order-detail-row">
                        <div class="detail-label">Order Date:</div>
                        <div class="detail-value">${formatDate(order.orderDate)}</div>
                    </div>
                    <div class="order-detail-row">
                        <div class="detail-label">Status:</div>
                        <div class="detail-value">${order.status}</div>
                    </div>
                    <div class="order-detail-row">
                        <div class="detail-label">Total Price:</div>
                        <div class="detail-value">$${parseFloat(order.totalPrice).toFixed(2)}</div>
                    </div>
                    <div class="error-message">Error loading order items: ${error.message}</div>
                `;
            });
        })
        .catch(error => {
            orderDetails.innerHTML = `<div class="error-message">Error loading order details: ${error.message}</div>`;
            console.error('Error loading order details:', error);
        });
    }
    
    function confirmDeleteOrder(orderId) {
        if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            deleteOrder(orderId);
        }
    }
    
    function deleteOrder(orderId) {
        // Get auth token
        const token = localStorage.getItem('authToken');
        
        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        
        // Delete order via API
        fetch(`/api/orders/${orderId}`, {
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
            successMessage.textContent = 'Order deleted successfully!';
            successMessage.style.display = 'block';
            
            // Reload orders
            loadOrders();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        })
        .catch(error => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Show error message
            errorMessage.textContent = `Failed to delete order: ${error.message}`;
            errorMessage.style.display = 'block';
            console.error('Error deleting order:', error);
        });
    }
    
    // Helper Functions
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
});