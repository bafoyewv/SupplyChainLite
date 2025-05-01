// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let products = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let productModal;
    let isEditing = false;
    let currentProductId = null;

    // Initialize modal
    const modalElement = document.getElementById('productModal');
    if (modalElement) {
        productModal = new bootstrap.Modal(modalElement);
    }

    // Add event listeners
    document.getElementById('addProductBtn')?.addEventListener('click', showAddProductModal);
    document.getElementById('saveProductBtn')?.addEventListener('click', saveProduct);
    document.getElementById('searchInput')?.addEventListener('input', filterProducts);
    document.getElementById('categoryFilter')?.addEventListener('change', filterProducts);
    document.getElementById('sortFilter')?.addEventListener('change', filterProducts);

    // Load initial products
    loadProducts();

    // Function to load products from API
    async function loadProducts() {
        try {
            // Show loading state
            showLoading(true);
            
            // In a real application, you would fetch from your API
            // const response = await fetch('/api/products');
            // products = await response.json();
            
            // For demo purposes, using mock data
            products = [
                {
                    id: 1,
                    name: "Laptop",
                    category: "electronics",
                    price: 999.99,
                    stock: 15,
                    status: "In Stock",
                    image: "https://via.placeholder.com/50"
                },
                {
                    id: 2,
                    name: "T-Shirt",
                    category: "clothing",
                    price: 19.99,
                    stock: 50,
                    status: "In Stock",
                    image: "https://via.placeholder.com/50"
                },
                {
                    id: 3,
                    name: "Smartphone",
                    category: "electronics",
                    price: 699.99,
                    stock: 0,
                    status: "Out of Stock",
                    image: "https://via.placeholder.com/50"
                }
            ];

            renderProducts();
        } catch (error) {
            showError('Failed to load products: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    // Function to render products in the table
    function renderProducts() {
        const tableBody = document.getElementById('productsTableBody');
        if (!tableBody) return;

        // Clear existing rows
        tableBody.innerHTML = '';

        // Get filtered and sorted products
        const filteredProducts = filterAndSortProducts(products);

        // Calculate pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        // Render each product
        paginatedProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50" height="50"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">
                        ${product.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Update pagination
        updatePagination(filteredProducts.length);
    }

    // Function to filter and sort products
    function filterAndSortProducts(products) {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const category = document.getElementById('categoryFilter')?.value || '';
        const sortOption = document.getElementById('sortFilter')?.value || 'name_asc';

        let filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || product.category === category;
            return matchesSearch && matchesCategory;
        });

        // Sort products
        filtered.sort((a, b) => {
            switch (sortOption) {
                case 'name_asc':
                    return a.name.localeCompare(b.name);
                case 'name_desc':
                    return b.name.localeCompare(a.name);
                case 'price_asc':
                    return a.price - b.price;
                case 'price_desc':
                    return b.price - a.price;
                default:
                    return 0;
            }
        });

        return filtered;
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

    // Function to show add product modal
    function showAddProductModal() {
        isEditing = false;
        currentProductId = null;
        document.getElementById('modalTitle').textContent = 'Add New Product';
        document.getElementById('productForm').reset();
        productModal.show();
    }

    // Function to edit product
    window.editProduct = function(productId) {
        isEditing = true;
        currentProductId = productId;
        const product = products.find(p => p.id === productId);
        
        if (product) {
            document.getElementById('modalTitle').textContent = 'Edit Product';
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productDescription').value = product.description || '';
            productModal.show();
        }
    };

    // Function to delete product
    window.deleteProduct = async function(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                // In a real application, you would make an API call
                // await fetch(`/api/products/${productId}`, { method: 'DELETE' });
                
                // For demo purposes, just remove from the array
                products = products.filter(p => p.id !== productId);
                renderProducts();
                showSuccess('Product deleted successfully');
            } catch (error) {
                showError('Failed to delete product: ' + error.message);
            }
        }
    };

    // Function to save product
    async function saveProduct() {
        const form = document.getElementById('productForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const productData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            description: document.getElementById('productDescription').value
        };

        try {
            if (isEditing) {
                // Update existing product
                const index = products.findIndex(p => p.id === currentProductId);
                if (index !== -1) {
                    products[index] = { ...products[index], ...productData };
                }
            } else {
                // Add new product
                const newId = Math.max(...products.map(p => p.id), 0) + 1;
                products.push({
                    id: newId,
                    ...productData,
                    status: productData.stock > 0 ? 'In Stock' : 'Out of Stock',
                    image: 'https://via.placeholder.com/50'
                });
            }

            renderProducts();
            productModal.hide();
            showSuccess(`Product ${isEditing ? 'updated' : 'added'} successfully`);
        } catch (error) {
            showError(`Failed to ${isEditing ? 'update' : 'add'} product: ` + error.message);
        }
    }

    // Function to change page
    window.changePage = function(page) {
        if (page >= 1 && page <= Math.ceil(products.length / itemsPerPage)) {
            currentPage = page;
            renderProducts();
        }
    };

    // Function to filter products
    function filterProducts() {
        currentPage = 1;
        renderProducts();
    }

    // Utility functions
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