// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let suppliers = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let supplierModal;
    let supplierDetailsModal;
    let isEditing = false;
    let currentSupplierId = null;

    // Initialize modals
    const supplierModalElement = document.getElementById('supplierModal');
    const supplierDetailsModalElement = document.getElementById('supplierDetailsModal');
    if (supplierModalElement) {
        supplierModal = new bootstrap.Modal(supplierModalElement);
    }
    if (supplierDetailsModalElement) {
        supplierDetailsModal = new bootstrap.Modal(supplierDetailsModalElement);
    }

    // Add event listeners
    document.getElementById('addSupplierBtn')?.addEventListener('click', showAddSupplierModal);
    document.getElementById('saveSupplierBtn')?.addEventListener('click', saveSupplier);
    document.getElementById('searchInput')?.addEventListener('input', filterSuppliers);
    document.getElementById('statusFilter')?.addEventListener('change', filterSuppliers);
    document.getElementById('categoryFilter')?.addEventListener('change', filterSuppliers);

    // Load initial data
    loadSuppliers();

    // Function to load suppliers from API
    async function loadSuppliers() {
        try {
            showLoading(true);
            
            // In a real application, you would fetch from your API
            // const response = await fetch('/api/suppliers');
            // suppliers = await response.json();
            
            // For demo purposes, using mock data
            suppliers = [
                {
                    id: 1,
                    name: "Tech Solutions Inc.",
                    contactPerson: "John Smith",
                    email: "john@techsolutions.com",
                    phone: "+1 234 567 8901",
                    category: "electronics",
                    status: "active",
                    address: "123 Tech Street, Silicon Valley, CA",
                    notes: "Main supplier for electronic components"
                },
                {
                    id: 2,
                    name: "Fashion World Ltd.",
                    contactPerson: "Sarah Johnson",
                    email: "sarah@fashionworld.com",
                    phone: "+1 234 567 8902",
                    category: "clothing",
                    status: "active",
                    address: "456 Fashion Avenue, New York, NY",
                    notes: "Premium clothing supplier"
                },
                {
                    id: 3,
                    name: "Fresh Foods Co.",
                    contactPerson: "Michael Brown",
                    email: "michael@freshfoods.com",
                    phone: "+1 234 567 8903",
                    category: "food",
                    status: "pending",
                    address: "789 Market Street, Chicago, IL",
                    notes: "Organic food supplier"
                }
            ];

            renderSuppliers();
        } catch (error) {
            showError('Failed to load suppliers: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    // Function to render suppliers in the table
    function renderSuppliers() {
        const tableBody = document.getElementById('suppliersTableBody');
        if (!tableBody) return;

        // Clear existing rows
        tableBody.innerHTML = '';

        // Get filtered suppliers
        const filteredSuppliers = filterSuppliers();

        // Calculate pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);

        // Render each supplier
        paginatedSuppliers.forEach(supplier => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${supplier.id}</td>
                <td>${supplier.name}</td>
                <td>${supplier.contactPerson}</td>
                <td>${supplier.email}</td>
                <td>${supplier.category}</td>
                <td>
                    <span class="badge ${getStatusBadgeClass(supplier.status)}">
                        ${supplier.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-info me-1" onclick="viewSupplierDetails(${supplier.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary me-1" onclick="editSupplier(${supplier.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSupplier(${supplier.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Update pagination
        updatePagination(filteredSuppliers.length);
    }

    // Function to filter suppliers
    function filterSuppliers() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const status = document.getElementById('statusFilter')?.value || '';
        const category = document.getElementById('categoryFilter')?.value || '';

        return suppliers.filter(supplier => {
            const matchesSearch = supplier.name.toLowerCase().includes(searchTerm) ||
                                supplier.contactPerson.toLowerCase().includes(searchTerm) ||
                                supplier.email.toLowerCase().includes(searchTerm);
            const matchesStatus = !status || supplier.status === status;
            const matchesCategory = !category || supplier.category === category;
            return matchesSearch && matchesStatus && matchesCategory;
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

    // Function to show add supplier modal
    function showAddSupplierModal() {
        isEditing = false;
        currentSupplierId = null;
        document.getElementById('modalTitle').textContent = 'Add New Supplier';
        document.getElementById('supplierForm').reset();
        supplierModal.show();
    }

    // Function to view supplier details
    window.viewSupplierDetails = function(supplierId) {
        const supplier = suppliers.find(s => s.id === supplierId);
        if (supplier) {
            const detailsHtml = `
                <div class="row mb-4">
                    <div class="col-md-6">
                        <h6>Supplier Information</h6>
                        <p><strong>Supplier ID:</strong> #${supplier.id}</p>
                        <p><strong>Name:</strong> ${supplier.name}</p>
                        <p><strong>Category:</strong> ${supplier.category}</p>
                        <p><strong>Status:</strong> <span class="badge ${getStatusBadgeClass(supplier.status)}">${supplier.status}</span></p>
                    </div>
                    <div class="col-md-6">
                        <h6>Contact Information</h6>
                        <p><strong>Contact Person:</strong> ${supplier.contactPerson}</p>
                        <p><strong>Email:</strong> ${supplier.email}</p>
                        <p><strong>Phone:</strong> ${supplier.phone}</p>
                        <p><strong>Address:</strong> ${supplier.address}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <h6>Additional Information</h6>
                        <p><strong>Notes:</strong> ${supplier.notes || 'No notes available'}</p>
                    </div>
                </div>
            `;
            
            document.getElementById('supplierDetailsContent').innerHTML = detailsHtml;
            supplierDetailsModal.show();
        }
    };

    // Function to edit supplier
    window.editSupplier = function(supplierId) {
        isEditing = true;
        currentSupplierId = supplierId;
        const supplier = suppliers.find(s => s.id === supplierId);
        
        if (supplier) {
            document.getElementById('modalTitle').textContent = 'Edit Supplier';
            document.getElementById('supplierName').value = supplier.name;
            document.getElementById('contactPerson').value = supplier.contactPerson;
            document.getElementById('email').value = supplier.email;
            document.getElementById('phone').value = supplier.phone;
            document.getElementById('category').value = supplier.category;
            document.getElementById('status').value = supplier.status;
            document.getElementById('address').value = supplier.address;
            document.getElementById('notes').value = supplier.notes || '';
            
            supplierModal.show();
        }
    };

    // Function to delete supplier
    window.deleteSupplier = async function(supplierId) {
        if (confirm('Are you sure you want to delete this supplier?')) {
            try {
                // In a real application, you would make an API call
                // await fetch(`/api/suppliers/${supplierId}`, { method: 'DELETE' });
                
                // For demo purposes, just remove from the array
                suppliers = suppliers.filter(s => s.id !== supplierId);
                renderSuppliers();
                showSuccess('Supplier deleted successfully');
            } catch (error) {
                showError('Failed to delete supplier: ' + error.message);
            }
        }
    };

    // Function to save supplier
    async function saveSupplier() {
        const form = document.getElementById('supplierForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const supplierData = {
            name: document.getElementById('supplierName').value,
            contactPerson: document.getElementById('contactPerson').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            category: document.getElementById('category').value,
            status: document.getElementById('status').value,
            address: document.getElementById('address').value,
            notes: document.getElementById('notes').value
        };

        try {
            if (isEditing) {
                // Update existing supplier
                const index = suppliers.findIndex(s => s.id === currentSupplierId);
                if (index !== -1) {
                    suppliers[index] = { ...suppliers[index], ...supplierData };
                }
            } else {
                // Add new supplier
                const newId = Math.max(...suppliers.map(s => s.id), 0) + 1;
                suppliers.push({
                    id: newId,
                    ...supplierData
                });
            }

            renderSuppliers();
            supplierModal.hide();
            showSuccess(`Supplier ${isEditing ? 'updated' : 'created'} successfully`);
        } catch (error) {
            showError(`Failed to ${isEditing ? 'update' : 'create'} supplier: ` + error.message);
        }
    }

    // Function to change page
    window.changePage = function(page) {
        if (page >= 1 && page <= Math.ceil(suppliers.length / itemsPerPage)) {
            currentPage = page;
            renderSuppliers();
        }
    };

    // Utility functions
    function getStatusBadgeClass(status) {
        switch (status) {
            case 'active': return 'bg-success';
            case 'inactive': return 'bg-danger';
            case 'pending': return 'bg-warning';
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