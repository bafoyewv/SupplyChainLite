// API endpoints
const API_BASE_URL = 'http://localhost:8080/api';
const API_ENDPOINTS = {
    products: `${API_BASE_URL}/products`,
    suppliers: `${API_BASE_URL}/suppliers`,
    orders: `${API_BASE_URL}/orders`,
    users: `${API_BASE_URL}/users`,
    inventory: `${API_BASE_URL}/inventory`
};

// Global state
let currentPage = 'dashboard';
let currentPageNumber = 1;
const pageSize = 10;

// Utility functions
function showAlert(message, type = 'success') {
    const alert = document.getElementById('alert');
    const alertMessage = document.getElementById('alert-message');
    alert.className = `alert alert-${type}`;
    alertMessage.textContent = message;
    alert.style.display = 'block';
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}

function showSpinner(element) {
    element.innerHTML = `
        <div class="spinner-container">
            <div class="spinner"></div>
        </div>
    `;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Navigation
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const page = item.dataset.page;
        navigateToPage(page);
    });
});

function navigateToPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.style.display = 'none';
    });

    // Show selected page
    document.getElementById(`${page}-page`).style.display = 'block';

    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });

    // Load page data
    currentPage = page;
    currentPageNumber = 1;
    loadPageData();
}

// Data loading
async function loadPageData() {
    switch (currentPage) {
        case 'dashboard':
            await loadDashboardData();
            break;
        case 'products':
            await loadProducts();
            break;
        case 'inventory':
            await loadInventory();
            break;
        case 'suppliers':
            await loadSuppliers();
            break;
        case 'orders':
            await loadOrders();
            break;
        case 'users':
            await loadUsers();
            break;
    }
}

// Dashboard
async function loadDashboardData() {
    try {
        const [products, suppliers, users, orders] = await Promise.all([
            fetch(API_ENDPOINTS.products).then(res => res.json()),
            fetch(API_ENDPOINTS.suppliers).then(res => res.json()),
            fetch(API_ENDPOINTS.users).then(res => res.json()),
            fetch(API_ENDPOINTS.orders).then(res => res.json())
        ]);

        // Update dashboard cards
        document.getElementById('total-products').textContent = products.length;
        document.getElementById('total-suppliers').textContent = suppliers.length;
        document.getElementById('total-users').textContent = users.length;
        document.getElementById('total-orders').textContent = orders.length;

        // Load low stock products
        const lowStockProducts = products.filter(p => p.stockQuantity < p.minimumStockLevel);
        updateLowStockTable(lowStockProducts);

        // Load recent orders
        const recentOrders = orders.slice(0, 5);
        updateRecentOrdersTable(recentOrders);
    } catch (error) {
        showAlert('Error loading dashboard data', 'danger');
        console.error(error);
    }
}

function updateLowStockTable(products) {
    const tbody = document.getElementById('low-stock-table');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td class="low-stock">${product.stockQuantity}</td>
            <td><span class="status status-warning">Low Stock</span></td>
            <td>${product.supplier.name}</td>
            <td>
                <button class="btn btn-primary action-btn" onclick="restockProduct(${product.id})">
                    <i class="fas fa-plus"></i> Restock
                </button>
            </td>
        </tr>
    `).join('');
}

function updateRecentOrdersTable(orders) {
    const tbody = document.getElementById('recent-orders-table');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${formatDate(order.orderDate)}</td>
            <td><span class="status status-${order.status.toLowerCase()}">${order.status}</span></td>
            <td>${order.user.fullName}</td>
            <td>
                <button class="btn btn-info action-btn" onclick="viewOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

// Products
async function loadProducts() {
    try {
        const response = await fetch(`${API_ENDPOINTS.products}?page=${currentPageNumber}&size=${pageSize}`);
        const data = await response.json();
        updateProductsTable(data.content);
        updatePagination('products-pagination', data.totalPages);
    } catch (error) {
        showAlert('Error loading products', 'danger');
        console.error(error);
    }
}

function updateProductsTable(products) {
    const tbody = document.getElementById('products-table');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.stockQuantity}</td>
            <td>${product.supplier.name}</td>
            <td>
                <button class="btn btn-info action-btn" onclick="viewProduct(${product.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-primary action-btn" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger action-btn" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Event listeners
document.getElementById('refresh-dashboard').addEventListener('click', loadDashboardData);
document.getElementById('add-product-btn').addEventListener('click', showAddProductModal);
document.getElementById('product-search').addEventListener('input', debounce(searchProducts, 300));

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPageData();
}); 