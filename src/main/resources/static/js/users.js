document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const users = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let editingUserId = null;
    
    // Get DOM elements
    const addUserBtn = document.getElementById('addUserBtn');
    const userModal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    const saveUserBtn = document.getElementById('saveUserBtn');
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const usersTable = document.getElementById('usersTable');
    const pagination = document.getElementById('pagination');
    const userDetailsModal = document.getElementById('userDetailsModal');
    
    // Event listeners
    addUserBtn.addEventListener('click', showAddUserModal);
    saveUserBtn.addEventListener('click', saveUser);
    searchInput.addEventListener('input', filterUsers);
    roleFilter.addEventListener('change', filterUsers);
    statusFilter.addEventListener('change', filterUsers);
    
    // Load initial data
    loadUsers();
    
    // Functions
    function loadUsers() {
        showLoading();
        // Simulate API call
        setTimeout(() => {
            // Mock data
            const mockUsers = [
                {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    role: 'admin',
                    status: 'active',
                    lastLogin: '2024-03-15 10:30:00',
                    phone: '+1234567890',
                    address: '123 Main St, City, Country',
                    notes: 'System administrator'
                },
                {
                    id: 2,
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane.smith@example.com',
                    role: 'manager',
                    status: 'active',
                    lastLogin: '2024-03-14 15:45:00',
                    phone: '+1987654321',
                    address: '456 Oak Ave, Town, Country',
                    notes: 'Sales manager'
                }
            ];
            
            users.length = 0;
            users.push(...mockUsers);
            renderUsers();
            hideLoading();
        }, 1000);
    }
    
    function renderUsers() {
        const filteredUsers = filterUsers();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        
        let tableHTML = '';
        
        paginatedUsers.forEach(user => {
            tableHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td><span class="user-role ${user.role}">${user.role}</span></td>
                    <td><span class="user-status ${user.status}">${user.status}</span></td>
                    <td>${formatDate(user.lastLogin)}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="viewUser(${user.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        usersTable.querySelector('tbody').innerHTML = tableHTML;
        updatePagination(filteredUsers.length);
    }
    
    function filterUsers() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedRole = roleFilter.value;
        const selectedStatus = statusFilter.value;
        
        return users.filter(user => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(searchTerm) || 
                                user.email.toLowerCase().includes(searchTerm);
            const matchesRole = selectedRole === 'all' || user.role === selectedRole;
            const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
            
            return matchesSearch && matchesRole && matchesStatus;
        });
    }
    
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        let paginationHTML = '';
        
        if (totalPages > 1) {
            paginationHTML += `
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
                </li>
            `;
            
            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                    <li class="page-item ${currentPage === i ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                    </li>
                `;
            }
            
            paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
                </li>
            `;
        }
        
        pagination.innerHTML = paginationHTML;
    }
    
    function showAddUserModal() {
        editingUserId = null;
        userForm.reset();
        userModal.querySelector('.modal-title').textContent = 'Add New User';
        new bootstrap.Modal(userModal).show();
    }
    
    function editUser(userId) {
        const user = users.find(u => u.id === userId);
        if (user) {
            editingUserId = userId;
            document.getElementById('firstName').value = user.firstName;
            document.getElementById('lastName').value = user.lastName;
            document.getElementById('email').value = user.email;
            document.getElementById('phone').value = user.phone;
            document.getElementById('role').value = user.role;
            document.getElementById('status').value = user.status;
            document.getElementById('address').value = user.address;
            document.getElementById('notes').value = user.notes;
            
            userModal.querySelector('.modal-title').textContent = 'Edit User';
            new bootstrap.Modal(userModal).show();
        }
    }
    
    function viewUser(userId) {
        const user = users.find(u => u.id === userId);
        if (user) {
            document.getElementById('viewFirstName').textContent = user.firstName;
            document.getElementById('viewLastName').textContent = user.lastName;
            document.getElementById('viewEmail').textContent = user.email;
            document.getElementById('viewPhone').textContent = user.phone;
            document.getElementById('viewRole').textContent = user.role;
            document.getElementById('viewStatus').textContent = user.status;
            document.getElementById('viewAddress').textContent = user.address;
            document.getElementById('viewNotes').textContent = user.notes;
            document.getElementById('viewLastLogin').textContent = formatDate(user.lastLogin);
            
            new bootstrap.Modal(userDetailsModal).show();
        }
    }
    
    function saveUser() {
        if (!validateUserForm()) {
            return;
        }
        
        const userData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            role: document.getElementById('role').value,
            status: document.getElementById('status').value,
            address: document.getElementById('address').value,
            notes: document.getElementById('notes').value,
            lastLogin: new Date().toISOString()
        };
        
        showLoading();
        
        // Simulate API call
        setTimeout(() => {
            if (editingUserId) {
                const index = users.findIndex(u => u.id === editingUserId);
                if (index !== -1) {
                    users[index] = { ...users[index], ...userData };
                }
            } else {
                const newId = Math.max(...users.map(u => u.id), 0) + 1;
                users.push({ id: newId, ...userData });
            }
            
            renderUsers();
            hideLoading();
            showSuccess('User saved successfully');
            bootstrap.Modal.getInstance(userModal).hide();
        }, 1000);
    }
    
    function deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            showLoading();
            
            // Simulate API call
            setTimeout(() => {
                const index = users.findIndex(u => u.id === userId);
                if (index !== -1) {
                    users.splice(index, 1);
                    renderUsers();
                    showSuccess('User deleted successfully');
                }
                hideLoading();
            }, 1000);
        }
    }
    
    function validateUserForm() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        
        if (!firstName || !lastName || !email) {
            showError('Please fill in all required fields');
            return false;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return false;
        }
        
        return true;
    }
    
    // Utility functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showLoading() {
        document.body.classList.add('loading');
    }
    
    function hideLoading() {
        document.body.classList.remove('loading');
    }
    
    function showSuccess(message) {
        alert(message);
    }
    
    function showError(message) {
        alert(message);
    }
    
    // Global functions for pagination
    window.changePage = function(page) {
        if (page >= 1 && page <= Math.ceil(filterUsers().length / itemsPerPage)) {
            currentPage = page;
            renderUsers();
        }
    };
    
    window.viewUser = viewUser;
    window.editUser = editUser;
    window.deleteUser = deleteUser;
}); 