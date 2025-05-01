document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let orderId = new URLSearchParams(window.location.search).get('id');
    let orderData = null;
    let statusModal = new bootstrap.Modal(document.getElementById('updateStatusModal'));

    // Initialize event listeners
    document.getElementById('printOrderBtn')?.addEventListener('click', printOrder);
    document.getElementById('updateStatusBtn')?.addEventListener('click', showStatusModal);
    document.getElementById('saveStatusBtn')?.addEventListener('click', updateOrderStatus);

    // Load order details
    loadOrderDetails();

    // Function to load order details
    async function loadOrderDetails() {
        try {
            showLoading(true);
            
            // In a real application, you would fetch from your API
            // const response = await fetch(`/api/orders/${orderId}`);
            // orderData = await response.json();
            
            // For demo purposes, using mock data
            orderData = {
                id: orderId || '12345',
                status: 'processing',
                customer: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+1 234 567 890',
                    address: '123 Main St, City, Country'
                },
                items: [
                    {
                        id: 1,
                        name: 'Product 1',
                        price: 99.99,
                        quantity: 2,
                        image: 'https://via.placeholder.com/50'
                    },
                    {
                        id: 2,
                        name: 'Product 2',
                        price: 49.99,
                        quantity: 1,
                        image: 'https://via.placeholder.com/50'
                    }
                ],
                timeline: [
                    {
                        date: '2024-03-01 10:00',
                        title: 'Order Placed',
                        description: 'Order was placed by customer'
                    },
                    {
                        date: '2024-03-01 11:30',
                        title: 'Payment Received',
                        description: 'Payment was successfully processed'
                    },
                    {
                        date: '2024-03-01 14:00',
                        title: 'Processing',
                        description: 'Order is being processed'
                    }
                ],
                summary: {
                    subtotal: 249.97,
                    shipping: 10.00,
                    tax: 25.00,
                    total: 284.97
                }
            };

            renderOrderDetails();
        } catch (error) {
            showError('Failed to load order details: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    // Function to render order details
    function renderOrderDetails() {
        if (!orderData) return;

        // Set order ID
        document.getElementById('orderId').textContent = orderData.id;

        // Set customer information
        document.getElementById('customerName').textContent = orderData.customer.name;
        document.getElementById('customerEmail').textContent = orderData.customer.email;
        document.getElementById('customerPhone').textContent = orderData.customer.phone;
        document.getElementById('customerAddress').textContent = orderData.customer.address;

        // Set order summary
        document.getElementById('subtotal').textContent = formatCurrency(orderData.summary.subtotal);
        document.getElementById('shipping').textContent = formatCurrency(orderData.summary.shipping);
        document.getElementById('tax').textContent = formatCurrency(orderData.summary.tax);
        document.getElementById('total').textContent = formatCurrency(orderData.summary.total);

        // Render order items
        renderOrderItems();

        // Render timeline
        renderTimeline();

        // Update status
        updateStatusDisplay();
    }

    // Function to render order items
    function renderOrderItems() {
        const tableBody = document.getElementById('orderItemsTable');
        if (!tableBody) return;

        tableBody.innerHTML = orderData.items.map(item => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" class="me-2" style="width: 50px; height: 50px; object-fit: cover;">
                        <span>${item.name}</span>
                    </div>
                </td>
                <td>${formatCurrency(item.price)}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price * item.quantity)}</td>
            </tr>
        `).join('');
    }

    // Function to render timeline
    function renderTimeline() {
        const timelineContainer = document.getElementById('orderTimeline');
        if (!timelineContainer) return;

        timelineContainer.innerHTML = orderData.timeline.map(event => `
            <div class="timeline-item">
                <div class="timeline-date">${formatDate(event.date)}</div>
                <div class="timeline-content">
                    <div class="timeline-title">${event.title}</div>
                    <div class="timeline-description">${event.description}</div>
                </div>
            </div>
        `).join('');
    }

    // Function to update status display
    function updateStatusDisplay() {
        const statusBadge = document.getElementById('orderStatus');
        if (!statusBadge) return;

        // Update status badge
        statusBadge.textContent = orderData.status;
        statusBadge.className = 'status-badge ' + orderData.status;

        // Update progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            let progress = 0;
            switch (orderData.status) {
                case 'processing':
                    progress = 50;
                    break;
                case 'shipped':
                    progress = 75;
                    break;
                case 'delivered':
                    progress = 100;
                    break;
                default:
                    progress = 25;
            }
            progressBar.style.width = progress + '%';
        }

        // Update steps
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            const statuses = ['ordered', 'processing', 'shipped', 'delivered'];
            if (statuses.indexOf(orderData.status) >= index) {
                step.classList.add('completed');
            } else {
                step.classList.remove('completed');
            }
        });
    }

    // Function to show status modal
    function showStatusModal() {
        const statusSelect = document.getElementById('statusSelect');
        if (statusSelect) {
            statusSelect.value = orderData.status;
        }
        statusModal.show();
    }

    // Function to update order status
    async function updateOrderStatus() {
        const newStatus = document.getElementById('statusSelect').value;
        const notes = document.getElementById('statusNotes').value;

        try {
            showLoading(true);
            
            // In a real application, you would make an API call
            // await fetch(`/api/orders/${orderId}/status`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         status: newStatus,
            //         notes: notes
            //     })
            // });
            
            // For demo purposes, just update the local data
            orderData.status = newStatus;
            orderData.timeline.push({
                date: new Date().toISOString(),
                title: 'Status Updated',
                description: `Status changed to ${newStatus}${notes ? ': ' + notes : ''}`
            });

            renderOrderDetails();
            statusModal.hide();
            showSuccess('Order status updated successfully');
        } catch (error) {
            showError('Failed to update order status: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    // Function to print order
    function printOrder() {
        window.print();
    }

    // Utility functions
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2);
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleString();
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