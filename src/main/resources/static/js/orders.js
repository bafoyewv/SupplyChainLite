// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let orders = [];
    let products = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let orderModal;
    let orderDetailsModal;
    let isEditing = false;
    let currentOrderId = null;

    // Initialize modals
    const orderModalElement = document.getElementById('orderModal');
    const orderDetailsModalElement = document.getElementById('orderDetailsModal');
    if (orderModalElement) {
        orderModal = new bootstrap.Modal(orderModalElement);
    }
    if (orderDetailsModalElement) {
        orderDetailsModal = new bootstrap.Modal(orderDetailsModalElement);
    }

    // Add event listeners
    document.getElementById('addOrderBtn')?.addEventListener('click', showAddOrderModal);
    document.getElementById('saveOrderBtn')?.addEventListener('click', saveOrder);
    document.getElementById('addOrderItemBtn')?.addEventListener('click', addOrderItem);
    document.getElementById('searchInput')?.addEventListener('input', filterOrders);
    document.getElementById('statusFilter')?.addEventListener('change', filterOrders);
    document.getElementById('dateFromFilter')?.addEventListener('change', filterOrders);
    document.getElementById('dateToFilter')?.addEventListener('change', filterOrders);
    document.getElementById('printOrderBtn')?.addEventListener('click', printOrder);

    // Load initial data
    loadProducts();
    loadOrders();

    // Function to load products from API
    async function loadProducts() {
        try {
            // In a real application, you would fetch from your API
            // const response = await fetch('/api/products');
            // products = await response.json();
            
            // For demo purposes, using mock data
            products = [
                {
                    id: 1,
                    name: "Laptop",
                    price: 999.99,
                    stock: 15
                },
                {
                    id: 2,
                    name: "T-Shirt",
                    price: 19.99,
                    stock: 50
                },
                {
                    id: 3,
                    name: "Smartphone",
                    price: 699.99,
                    stock: 20
                }
            ];
        } catch (error) {
            showError('Failed to load products: ' + error.message);
        }
    }

    // Function to load orders from API
    async function loadOrders() {
        try {
            showLoading(true);
            
            // In a real application, you would fetch from your API
            // const response = await fetch('/api/orders');
            // orders = await response.json();
            
            // For demo purposes, using mock data
            orders = [
                {
                    id: 1,
                    customerName: "John Doe",
                    customerEmail: "john@example.com",
                    customerPhone: "1234567890",
                    date: "2024-03-15",
                    status: "pending",
                    paymentStatus: "pending",
                    paymentMethod: "credit_card",
                    shippingAddress: "123 Main St, City, Country",
                    items: [
                        { productId: 1, quantity: 1, price: 999.99 },
                        { productId: 2, quantity: 2, price: 19.99 }
                    ],
                    subtotal: 1039.97,
                    totalAmount: 1039.97
                },
                {
                    id: 2,
                    customerName: "Jane Smith",
                    customerEmail: "jane@example.com",
                    customerPhone: "0987654321",
                    date: "2024-03-14",
                    status: "shipped",
                    paymentStatus: "paid",
                    paymentMethod: "paypal",
                    shippingAddress: "456 Oak Ave, Town, Country",
                    items: [
                        { productId: 3, quantity: 1, price: 699.99 }
                    ],
                    subtotal: 699.99,
                    totalAmount: 699.99
                }
            ];

            renderOrders();
        } catch (error) {
            showError('Failed to load orders: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    // Function to render orders in the table
    function renderOrders() {
        const tableBody = document.getElementById('ordersTableBody');
        if (!tableBody) return;

        // Clear existing rows
        tableBody.innerHTML = '';

        // Get filtered orders
        const filteredOrders = filterOrders();

        // Calculate pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

        // Render each order
        paginatedOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.date}</td>
                <td>$${order.totalAmount.toFixed(2)}</td>
                <td>
                    <span class="badge ${getStatusBadgeClass(order.status)}">
                        ${order.status}
                    </span>
                </td>
                <td>
                    <span class="badge ${getPaymentStatusBadgeClass(order.paymentStatus)}">
                        ${order.paymentStatus}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-info me-1" onclick="viewOrderDetails(${order.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary me-1" onclick="editOrder(${order.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteOrder(${order.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Update pagination
        updatePagination(filteredOrders.length);
    }

    // Function to filter orders
    function filterOrders() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const status = document.getElementById('statusFilter')?.value || '';
        const dateFrom = document.getElementById('dateFromFilter')?.value || '';
        const dateTo = document.getElementById('dateToFilter')?.value || '';

        return orders.filter(order => {
            const matchesSearch = order.customerName.toLowerCase().includes(searchTerm) ||
                                order.customerEmail.toLowerCase().includes(searchTerm);
            const matchesStatus = !status || order.status === status;
            const matchesDate = (!dateFrom || order.date >= dateFrom) &&
                              (!dateTo || order.date <= dateTo);
            return matchesSearch && matchesStatus && matchesDate;
        });
    }

    // Function to update pagination
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;

        let html = `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        }

        html += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
            </li>
        `;

        pagination.innerHTML = html;
    }

    // Function to show add order modal
    function showAddOrderModal() {
        isEditing = false;
        currentOrderId = null;
        document.getElementById('modalTitle').textContent = 'Create New Order';
        document.getElementById('orderForm').reset();
        document.getElementById('orderItems').innerHTML = '';
        document.getElementById('subtotal').value = '0.00';
        document.getElementById('totalAmount').value = '0.00';
        orderModal.show();
    }

    // Function to add order item
    function addOrderItem() {
        const orderItems = document.getElementById('orderItems');
        const itemCount = orderItems.children.length;
        
        const itemHtml = `
            <div class="row mb-3 order-item" data-item-id="${itemCount}">
                <div class="col-md-4">
                    <select class="form-select product-select" required>
                        <option value="">Select Product</option>
                        ${products.map(p => `<option value="${p.id}" data-price="${p.price}">${p.name} - $${p.price}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-3">
                    <input type="number" class="form-control quantity" min="1" value="1" required>
                </div>
                <div class="col-md-3">
                    <input type="number" class="form-control price" readonly>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger btn-sm" onclick="removeOrderItem(${itemCount})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        orderItems.insertAdjacentHTML('beforeend', itemHtml);
        
        // Add event listeners to the new item
        const newItem = orderItems.lastElementChild;
        newItem.querySelector('.product-select').addEventListener('change', updateItemPrice);
        newItem.querySelector('.quantity').addEventListener('change', updateItemPrice);
        
        updateOrderTotal();
    }

    // Function to update item price
    function updateItemPrice(event) {
        const item = event.target.closest('.order-item');
        const productSelect = item.querySelector('.product-select');
        const quantityInput = item.querySelector('.quantity');
        const priceInput = item.querySelector('.price');
        
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        const price = selectedOption ? parseFloat(selectedOption.dataset.price) : 0;
        const quantity = parseInt(quantityInput.value) || 0;
        
        priceInput.value = (price * quantity).toFixed(2);
        updateOrderTotal();
    }

    // Function to update order total
    function updateOrderTotal() {
        const items = document.querySelectorAll('.order-item');
        let subtotal = 0;
        
        items.forEach(item => {
            const price = parseFloat(item.querySelector('.price').value) || 0;
            subtotal += price;
        });
        
        document.getElementById('subtotal').value = subtotal.toFixed(2);
        document.getElementById('totalAmount').value = subtotal.toFixed(2);
    }

    // Function to remove order item
    window.removeOrderItem = function(itemId) {
        const item = document.querySelector(`.order-item[data-item-id="${itemId}"]`);
        if (item) {
            item.remove();
            updateOrderTotal();
        }
    };

    // Function to view order details
    window.viewOrderDetails = function(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            const detailsHtml = `
                <div class="row mb-4">
                    <div class="col-md-6">
                        <h6>Order Information</h6>
                        <p><strong>Order ID:</strong> #${order.id}</p>
                        <p><strong>Date:</strong> ${order.date}</p>
                        <p><strong>Status:</strong> <span class="badge ${getStatusBadgeClass(order.status)}">${order.status}</span></p>
                    </div>
                    <div class="col-md-6">
                        <h6>Customer Information</h6>
                        <p><strong>Name:</strong> ${order.customerName}</p>
                        <p><strong>Email:</strong> ${order.customerEmail}</p>
                        <p><strong>Phone:</strong> ${order.customerPhone}</p>
                        <p><strong>Address:</strong> ${order.shippingAddress}</p>
                    </div>
                </div>
                <div class="row mb-4">
                    <div class="col-12">
                        <h6>Order Items</h6>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.items.map(item => {
                                    const product = products.find(p => p.id === item.productId);
                                    return `
                                        <tr>
                                            <td>${product ? product.name : 'Unknown Product'}</td>
                                            <td>${item.quantity}</td>
                                            <td>$${item.price.toFixed(2)}</td>
                                            <td>$${(item.quantity * item.price).toFixed(2)}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" class="text-end"><strong>Total:</strong></td>
                                    <td><strong>$${order.totalAmount.toFixed(2)}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <h6>Payment Information</h6>
                        <p><strong>Method:</strong> ${order.paymentMethod}</p>
                        <p><strong>Status:</strong> <span class="badge ${getPaymentStatusBadgeClass(order.paymentStatus)}">${order.paymentStatus}</span></p>
                    </div>
                </div>
            `;
            
            document.getElementById('orderDetailsContent').innerHTML = detailsHtml;
            orderDetailsModal.show();
        }
    };

    // Function to edit order
    window.editOrder = function(orderId) {
        isEditing = true;
        currentOrderId = orderId;
        const order = orders.find(o => o.id === orderId);
        
        if (order) {
            document.getElementById('modalTitle').textContent = 'Edit Order';
            document.getElementById('customerName').value = order.customerName;
            document.getElementById('customerEmail').value = order.customerEmail;
            document.getElementById('customerPhone').value = order.customerPhone;
            document.getElementById('orderStatus').value = order.status;
            document.getElementById('shippingAddress').value = order.shippingAddress;
            document.getElementById('paymentMethod').value = order.paymentMethod;
            document.getElementById('paymentStatus').value = order.paymentStatus;
            
            // Clear existing items
            const orderItems = document.getElementById('orderItems');
            orderItems.innerHTML = '';
            
            // Add order items
            order.items.forEach(item => {
                addOrderItem();
                const lastItem = orderItems.lastElementChild;
                const productSelect = lastItem.querySelector('.product-select');
                const quantityInput = lastItem.querySelector('.quantity');
                
                productSelect.value = item.productId;
                quantityInput.value = item.quantity;
                
                // Trigger change event to update prices
                productSelect.dispatchEvent(new Event('change'));
            });
            
            document.getElementById('subtotal').value = order.subtotal.toFixed(2);
            document.getElementById('totalAmount').value = order.totalAmount.toFixed(2);
            
            orderModal.show();
        }
    };

    // Function to delete order
    window.deleteOrder = async function(orderId) {
        if (confirm('Are you sure you want to delete this order?')) {
            try {
                // In a real application, you would make an API call
                // await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
                
                // For demo purposes, just remove from the array
                orders = orders.filter(o => o.id !== orderId);
                renderOrders();
                showSuccess('Order deleted successfully');
            } catch (error) {
                showError('Failed to delete order: ' + error.message);
            }
        }
    };

    // Function to save order
    async function saveOrder() {
        const form = document.getElementById('orderForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const orderData = {
            customerName: document.getElementById('customerName').value,
            customerEmail: document.getElementById('customerEmail').value,
            customerPhone: document.getElementById('customerPhone').value,
            orderStatus: document.getElementById('orderStatus').value,
            shippingAddress: document.getElementById('shippingAddress').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            paymentStatus: document.getElementById('paymentStatus').value,
            items: [],
            subtotal: parseFloat(document.getElementById('subtotal').value),
            totalAmount: parseFloat(document.getElementById('totalAmount').value)
        };

        // Collect order items
        document.querySelectorAll('.order-item').forEach(item => {
            const productSelect = item.querySelector('.product-select');
            const quantityInput = item.querySelector('.quantity');
            const priceInput = item.querySelector('.price');
            
            orderData.items.push({
                productId: parseInt(productSelect.value),
                quantity: parseInt(quantityInput.value),
                price: parseFloat(priceInput.value) / parseInt(quantityInput.value)
            });
        });

        try {
            if (isEditing) {
                // Update existing order
                const index = orders.findIndex(o => o.id === currentOrderId);
                if (index !== -1) {
                    orders[index] = { ...orders[index], ...orderData };
                }
            } else {
                // Add new order
                const newId = Math.max(...orders.map(o => o.id), 0) + 1;
                orders.push({
                    id: newId,
                    date: new Date().toISOString().split('T')[0],
                    ...orderData
                });
            }

            renderOrders();
            orderModal.hide();
            showSuccess(`Order ${isEditing ? 'updated' : 'created'} successfully`);
        } catch (error) {
            showError(`Failed to ${isEditing ? 'update' : 'create'} order: ` + error.message);
        }
    }

    // Function to change page
    window.changePage = function(page) {
        if (page >= 1 && page <= Math.ceil(orders.length / itemsPerPage)) {
            currentPage = page;
            renderOrders();
        }
    };

    // Function to print order
    window.printOrder = function() {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Order Details</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    <style>
                        body { padding: 20px; }
                        @media print {
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    ${document.getElementById('orderDetailsContent').innerHTML}
                    <div class="text-center mt-4 no-print">
                        <button onclick="window.print()" class="btn btn-primary">Print</button>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    // Utility functions
    function getStatusBadgeClass(status) {
        switch (status) {
            case 'pending': return 'bg-warning';
            case 'processing': return 'bg-info';
            case 'shipped': return 'bg-primary';
            case 'delivered': return 'bg-success';
            case 'cancelled': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    function getPaymentStatusBadgeClass(status) {
        switch (status) {
            case 'pending': return 'bg-warning';
            case 'paid': return 'bg-success';
            case 'failed': return 'bg-danger';
            case 'refunded': return 'bg-info';
            default: return 'bg-secondary';
        }
    }

    function showLoading(show) {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-overlay';
        loadingElement.innerHTML = '<div class="spinner-border text-primary"></div>';
        
        if (show) {
            document.body.appendChild(loadingElement);
        } else {
            const existing = document.querySelector('.loading-overlay');
            if (existing) existing.remove();
        }
    }

    function showSuccess(message) {
        showAlert('success', message);
    }

    function showError(message) {
        showAlert('danger', message);
    }

    function showAlert(type, message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}); 