// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal.id);
        }
    });
});

// Product Modal
function showAddProductModal() {
    showModal('add-product-modal');
}

function showEditProductModal(productId) {
    // Load product data
    fetch(`${API_ENDPOINTS.products}/${productId}`)
        .then(res => res.json())
        .then(product => {
            document.getElementById('edit-product-id').value = product.id;
            document.getElementById('edit-product-name').value = product.name;
            document.getElementById('edit-product-description').value = product.description;
            document.getElementById('edit-product-price').value = product.price;
            document.getElementById('edit-product-stock').value = product.stockQuantity;
            document.getElementById('edit-product-min-stock').value = product.minimumStockLevel;
            document.getElementById('edit-product-supplier').value = product.supplier.id;
            showModal('edit-product-modal');
        })
        .catch(error => {
            showAlert('Error loading product data', 'danger');
            console.error(error);
        });
}

// Supplier Modal
function showAddSupplierModal() {
    showModal('add-supplier-modal');
}

function showEditSupplierModal(supplierId) {
    // Load supplier data
    fetch(`${API_ENDPOINTS.suppliers}/${supplierId}`)
        .then(res => res.json())
        .then(supplier => {
            document.getElementById('edit-supplier-id').value = supplier.id;
            document.getElementById('edit-supplier-name').value = supplier.name;
            document.getElementById('edit-supplier-contact').value = supplier.contactPerson;
            document.getElementById('edit-supplier-email').value = supplier.email;
            document.getElementById('edit-supplier-phone').value = supplier.phone;
            document.getElementById('edit-supplier-address').value = supplier.address;
            showModal('edit-supplier-modal');
        })
        .catch(error => {
            showAlert('Error loading supplier data', 'danger');
            console.error(error);
        });
}

// Order Modal
function showAddOrderModal() {
    // Load products and users for dropdowns
    Promise.all([
        fetch(API_ENDPOINTS.products).then(res => res.json()),
        fetch(API_ENDPOINTS.users).then(res => res.json())
    ]).then(([products, users]) => {
        const productSelect = document.getElementById('order-product');
        const userSelect = document.getElementById('order-user');

        productSelect.innerHTML = products.map(p => 
            `<option value="${p.id}">${p.name} - ${formatCurrency(p.price)}</option>`
        ).join('');

        userSelect.innerHTML = users.map(u => 
            `<option value="${u.id}">${u.fullName}</option>`
        ).join('');

        showModal('add-order-modal');
    }).catch(error => {
        showAlert('Error loading order form data', 'danger');
        console.error(error);
    });
}

function showOrderDetailsModal(orderId) {
    // Load order details
    fetch(`${API_ENDPOINTS.orders}/${orderId}`)
        .then(res => res.json())
        .then(order => {
            document.getElementById('order-details-id').textContent = order.id;
            document.getElementById('order-details-date').textContent = formatDate(order.orderDate);
            document.getElementById('order-details-status').textContent = order.status;
            document.getElementById('order-details-user').textContent = order.user.fullName;
            document.getElementById('order-details-total').textContent = formatCurrency(order.totalAmount);
            
            const itemsList = document.getElementById('order-details-items');
            itemsList.innerHTML = order.orderItems.map(item => `
                <li>
                    ${item.product.name} - ${item.quantity} x ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.totalPrice)}
                </li>
            `).join('');

            showModal('order-details-modal');
        })
        .catch(error => {
            showAlert('Error loading order details', 'danger');
            console.error(error);
        });
}

// Form submission handlers
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const product = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(API_ENDPOINTS.products, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            showAlert('Product added successfully');
            hideModal('add-product-modal');
            loadProducts();
        } else {
            throw new Error('Failed to add product');
        }
    } catch (error) {
        showAlert('Error adding product', 'danger');
        console.error(error);
    }
});

document.getElementById('add-supplier-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const supplier = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(API_ENDPOINTS.suppliers, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(supplier)
        });

        if (response.ok) {
            showAlert('Supplier added successfully');
            hideModal('add-supplier-modal');
            loadSuppliers();
        } else {
            throw new Error('Failed to add supplier');
        }
    } catch (error) {
        showAlert('Error adding supplier', 'danger');
        console.error(error);
    }
});

document.getElementById('add-order-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const order = {
        userId: formData.get('userId'),
        items: [{
            productId: formData.get('productId'),
            quantity: parseInt(formData.get('quantity'))
        }]
    };

    try {
        const response = await fetch(API_ENDPOINTS.orders, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        if (response.ok) {
            showAlert('Order created successfully');
            hideModal('add-order-modal');
            loadOrders();
        } else {
            throw new Error('Failed to create order');
        }
    } catch (error) {
        showAlert('Error creating order', 'danger');
        console.error(error);
    }
}); 