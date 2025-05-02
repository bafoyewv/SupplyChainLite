const { useState, useEffect } = React;

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function for authenticated API calls
const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
        throw new Error('Authentication token expired');
    }

    return response;
};

// Auth Context
const AuthContext = React.createContext(null);

function Login({ onSwitch, onLogin, notification }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Login failed');
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            onLogin();
        } catch (err) {
            onLogin('Login yoki parol xato!');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card shadow p-4" style={{ minWidth: 350, maxWidth: 400, width: '100%' }}>
                <h3 className="mb-4 text-center">Tizimga kirish</h3>
                {notification && <div className="alert alert-danger">{notification}</div>}
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-3">
                        <label className="form-label">Login</label>
                        <input type="text" className="form-control" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required autoFocus />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Parol</label>
                        <input type="password" className="form-control" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Kirish...' : 'Kirish'}</button>
                </form>
                <div className="text-center mt-3">
                    <button className="btn btn-link p-0" onClick={onSwitch}>Ro‘yxatdan o‘tish</button>
                </div>
            </div>
        </div>
    );
}

function Register({ onSwitch, onRegister, notification }) {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            onRegister('Parollar mos emas!');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password })
            });
            if (!response.ok) throw new Error('Register failed');
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            onRegister();
        } catch (err) {
            onRegister('Ro‘yxatdan o‘tishda xatolik!');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card shadow p-4" style={{ minWidth: 350, maxWidth: 400, width: '100%' }}>
                <h3 className="mb-4 text-center">Ro‘yxatdan o‘tish</h3>
                {notification && <div className="alert alert-danger">{notification}</div>}
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-3">
                        <label className="form-label">Login</label>
                        <input type="text" className="form-control" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required autoFocus />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Parol</label>
                        <input type="password" className="form-control" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Parolni tasdiqlang</label>
                        <input type="password" className="form-control" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Yuborilmoqda...' : 'Ro‘yxatdan o‘tish'}</button>
                </form>
                <div className="text-center mt-3">
                    <button className="btn btn-link p-0" onClick={onSwitch}>Kirish</button>
                </div>
            </div>
        </div>
    );
}

// Components
function Dashboard({ showNotification }) {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalSuppliers: 0,
        totalUsers: 0,
        totalOrders: 0
    });

    useEffect(() => {
        // Fetch dashboard statistics
        authenticatedFetch(`${API_BASE_URL}/dashboard/stats`)
            .then(response => response.json())
            .then(data => setStats(data))
            .catch(error => showNotification('Error fetching dashboard data', 'danger'));
    }, [showNotification]);

    return (
        <div className="row">
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card stat-card primary h-100">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Total Products</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalProducts}</div>
                            </div>
                            <div className="col-auto">
                                <i className="bi bi-box-seam fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card stat-card success h-100">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Total Suppliers</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalSuppliers}</div>
                            </div>
                            <div className="col-auto">
                                <i className="bi bi-truck fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card stat-card info h-100">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                    Total Users</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalUsers}</div>
                            </div>
                            <div className="col-auto">
                                <i className="bi bi-people fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card stat-card warning h-100">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                    Total Orders</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalOrders}</div>
                            </div>
                            <div className="col-auto">
                                <i className="bi bi-cart fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductModal({ show, onClose, product, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        supplierId: ''
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                name: '',
                description: '',
                category: '',
                price: '',
                stock: '',
                supplierId: ''
            });
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className={`modal ${show ? 'show d-block' : ''}`} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{product ? 'Edit Product' : 'Add Product'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control"
                                       value={formData.name}
                                       onChange={e => setFormData({...formData, name: e.target.value})}
                                       required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control"
                                          value={formData.description}
                                          onChange={e => setFormData({...formData, description: e.target.value})}
                                          required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <input type="text" className="form-control"
                                       value={formData.category}
                                       onChange={e => setFormData({...formData, category: e.target.value})}
                                       required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Price</label>
                                <input type="number" className="form-control"
                                       value={formData.price}
                                       onChange={e => setFormData({...formData, price: e.target.value})}
                                       required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Stock</label>
                                <input type="number" className="form-control"
                                       value={formData.stock}
                                       onChange={e => setFormData({...formData, stock: e.target.value})}
                                       required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Supplier</label>
                                <select className="form-control"
                                        value={formData.supplierId}
                                        onChange={e => setFormData({...formData, supplierId: e.target.value})}
                                        required>
                                    <option value="">Select Supplier</option>
                                    {/* Suppliers will be populated from API */}
                                </select>
                            </div>
                            <div className="text-end">
                                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Products({ showNotification }) {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        authenticatedFetch(`${API_BASE_URL}/products`)
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => showNotification('Error fetching products', 'danger'));
    };

    const handleSubmit = (formData) => {
        const url = currentProduct 
            ? `${API_BASE_URL}/products/${currentProduct.id}`
            : `${API_BASE_URL}/products`;
        
        authenticatedFetch(url, {
            method: currentProduct ? 'PUT' : 'POST',
            body: JSON.stringify(formData)
        })
        .then(() => {
            fetchProducts();
            setShowModal(false);
            showNotification(`Product ${currentProduct ? 'updated' : 'added'} successfully`, 'success');
        })
        .catch(error => showNotification('Error saving product', 'danger'));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            authenticatedFetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE'
            })
            .then(() => {
                fetchProducts();
                showNotification('Product deleted successfully', 'success');
            })
            .catch(error => showNotification('Error deleting product', 'danger'));
        }
    };

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary">Products</h6>
                <button className="btn btn-primary" onClick={() => {
                    setCurrentProduct(null);
                    setShowModal(true);
                }}>
                    <i className="bi bi-plus"></i> Add Product
                </button>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>${product.price}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => {
                                            setCurrentProduct(product);
                                            setShowModal(true);
                                        }}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductModal
                show={showModal}
                onClose={() => setShowModal(false)}
                product={currentProduct}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

function Inventory({ showNotification }) {
    const [lowStockProducts, setLowStockProducts] = useState([]);

    useEffect(() => {
        authenticatedFetch(`${API_BASE_URL}/inventory/low-stock`)
            .then(response => response.json())
            .then(data => setLowStockProducts(data))
            .catch(error => showNotification('Error fetching low stock products', 'danger'));
    }, [showNotification]);

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Low Stock Products</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Name</th>
                                <th>Current Stock</th>
                                <th>Minimum Required</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockProducts.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.currentStock}</td>
                                    <td>{product.minimumRequired}</td>
                                    <td>
                                        <span className={`badge bg-${product.currentStock < product.minimumRequired ? 'danger' : 'warning'}`}>
                                            {product.currentStock < product.minimumRequired ? 'Critical' : 'Low'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function Suppliers({ showNotification }) {
    const [suppliers, setSuppliers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = () => {
        authenticatedFetch(`${API_BASE_URL}/suppliers`)
            .then(response => response.json())
            .then(data => setSuppliers(data))
            .catch(error => showNotification('Error fetching suppliers', 'danger'));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = currentSupplier 
            ? `${API_BASE_URL}/suppliers/${currentSupplier.id}`
            : `${API_BASE_URL}/suppliers`;
        
        authenticatedFetch(url, {
            method: currentSupplier ? 'PUT' : 'POST',
            body: JSON.stringify(formData)
        })
        .then(() => {
            fetchSuppliers();
            setShowModal(false);
            showNotification(`Supplier ${currentSupplier ? 'updated' : 'added'} successfully`, 'success');
        })
        .catch(error => showNotification('Error saving supplier', 'danger'));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            authenticatedFetch(`${API_BASE_URL}/suppliers/${id}`, {
                method: 'DELETE'
            })
            .then(() => {
                fetchSuppliers();
                showNotification('Supplier deleted successfully', 'success');
            })
            .catch(error => showNotification('Error deleting supplier', 'danger'));
        }
    };

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary">Suppliers</h6>
                <button className="btn btn-primary" onClick={() => {
                    setCurrentSupplier(null);
                    setFormData({
                        name: '',
                        contactPerson: '',
                        email: '',
                        phone: '',
                        address: ''
                    });
                    setShowModal(true);
                }}>
                    <i className="bi bi-plus"></i> Add Supplier
                </button>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Contact Person</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map(supplier => (
                                <tr key={supplier.id}>
                                    <td>{supplier.id}</td>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.contactPerson}</td>
                                    <td>{supplier.email}</td>
                                    <td>{supplier.phone}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => {
                                            setCurrentSupplier(supplier);
                                            setFormData(supplier);
                                            setShowModal(true);
                                        }}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(supplier.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Supplier Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{currentSupplier ? 'Edit Supplier' : 'Add Supplier'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" className="form-control" 
                                               value={formData.name}
                                               onChange={e => setFormData({...formData, name: e.target.value})}
                                               required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Contact Person</label>
                                        <input type="text" className="form-control"
                                               value={formData.contactPerson}
                                               onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                                               required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control"
                                               value={formData.email}
                                               onChange={e => setFormData({...formData, email: e.target.value})}
                                               required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Phone</label>
                                        <input type="tel" className="form-control"
                                               value={formData.phone}
                                               onChange={e => setFormData({...formData, phone: e.target.value})}
                                               required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Address</label>
                                        <textarea className="form-control"
                                                  value={formData.address}
                                                  onChange={e => setFormData({...formData, address: e.target.value})}
                                                  required />
                                    </div>
                                    <div className="text-end">
                                        <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Orders({ showNotification }) {
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [formData, setFormData] = useState({
        userId: '',
        productId: '',
        quantity: '',
        status: 'PENDING'
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        authenticatedFetch(`${API_BASE_URL}/orders`)
            .then(response => response.json())
            .then(data => setOrders(data))
            .catch(error => showNotification('Error fetching orders', 'danger'));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = currentOrder 
            ? `${API_BASE_URL}/orders/${currentOrder.id}`
            : `${API_BASE_URL}/orders`;
        
        authenticatedFetch(url, {
            method: currentOrder ? 'PUT' : 'POST',
            body: JSON.stringify(formData)
        })
        .then(() => {
            fetchOrders();
            setShowModal(false);
            showNotification(`Order ${currentOrder ? 'updated' : 'created'} successfully`, 'success');
        })
        .catch(error => showNotification('Error saving order', 'danger'));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            authenticatedFetch(`${API_BASE_URL}/orders/${id}`, {
                method: 'DELETE'
            })
            .then(() => {
                fetchOrders();
                showNotification('Order deleted successfully', 'success');
            })
            .catch(error => showNotification('Error deleting order', 'danger'));
        }
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            'PENDING': 'warning',
            'PROCESSING': 'info',
            'COMPLETED': 'success',
            'CANCELLED': 'danger'
        };
        return <span className={`badge bg-${statusColors[status]}`}>{status}</span>;
    };

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary">Orders</h6>
                <button className="btn btn-primary" onClick={() => {
                    setCurrentOrder(null);
                    setFormData({
                        userId: '',
                        productId: '',
                        quantity: '',
                        status: 'PENDING'
                    });
                    setShowModal(true);
                }}>
                    <i className="bi bi-plus"></i> Create Order
                </button>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.userName}</td>
                                    <td>{order.productName}</td>
                                    <td>{order.quantity}</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => {
                                            setCurrentOrder(order);
                                            setFormData(order);
                                            setShowModal(true);
                                        }}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(order.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{currentOrder ? 'Edit Order' : 'Create Order'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">User</label>
                                        <select className="form-control"
                                                value={formData.userId}
                                                onChange={e => setFormData({...formData, userId: e.target.value})}
                                                required>
                                            <option value="">Select User</option>
                                            {/* Users will be populated from API */}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Product</label>
                                        <select className="form-control"
                                                value={formData.productId}
                                                onChange={e => setFormData({...formData, productId: e.target.value})}
                                                required>
                                            <option value="">Select Product</option>
                                            {/* Products will be populated from API */}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Quantity</label>
                                        <input type="number" className="form-control"
                                               value={formData.quantity}
                                               onChange={e => setFormData({...formData, quantity: e.target.value})}
                                               required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Status</label>
                                        <select className="form-control"
                                                value={formData.status}
                                                onChange={e => setFormData({...formData, status: e.target.value})}
                                                required>
                                            <option value="PENDING">Pending</option>
                                            <option value="PROCESSING">Processing</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </div>
                                    <div className="text-end">
                                        <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Users({ showNotification }) {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'USER'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch(`${API_BASE_URL}/users`)
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => showNotification('Error fetching users', 'danger'));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = currentUser 
            ? `${API_BASE_URL}/users/${currentUser.id}`
            : `${API_BASE_URL}/users`;
        
        fetch(url, {
            method: currentUser ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            fetchUsers();
            setShowModal(false);
            showNotification(`User ${currentUser ? 'updated' : 'created'} successfully`, 'success');
        })
        .catch(error => showNotification('Error saving user', 'danger'));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'DELETE'
            })
            .then(() => {
                fetchUsers();
                showNotification('User deleted successfully', 'success');
            })
            .catch(error => showNotification('Error deleting user', 'danger'));
        }
    };

    const getRoleBadge = (role) => {
        const roleColors = {
            'ADMIN': 'danger',
            'MANAGER': 'warning',
            'USER': 'info'
        };
        return <span className={`badge bg-${roleColors[role]}`}>{role}</span>;
    };

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary">Users</h6>
                <button className="btn btn-primary" onClick={() => {
                    setCurrentUser(null);
                    setFormData({
                        username: '',
                        email: '',
                        password: '',
                        role: 'USER'
                    });
                    setShowModal(true);
                }}>
                    <i className="bi bi-plus"></i> Add User
                </button>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{getRoleBadge(user.role)}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => {
                                            setCurrentUser(user);
                                            setFormData({
                                                ...user,
                                                password: '' // Don't show password when editing
                                            });
                                            setShowModal(true);
                                        }}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{currentUser ? 'Edit User' : 'Add User'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Username</label>
                                        <input type="text" className="form-control"
                                               value={formData.username}
                                               onChange={e => setFormData({...formData, username: e.target.value})}
                                               required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control"
                                               value={formData.email}
                                               onChange={e => setFormData({...formData, email: e.target.value})}
                                               required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input type="password" className="form-control"
                                               value={formData.password}
                                               onChange={e => setFormData({...formData, password: e.target.value})}
                                               required={!currentUser} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Role</label>
                                        <select className="form-control"
                                                value={formData.role}
                                                onChange={e => setFormData({...formData, role: e.target.value})}
                                                required>
                                            <option value="USER">User</option>
                                            <option value="MANAGER">Manager</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                    <div className="text-end">
                                        <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [notification, setNotification] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Global notification function
    const showNotification = (message, type = 'danger') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
            setCurrentPage('dashboard');
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
    }, []);

    // Handle login success or error
    const handleLogin = (error) => {
        if (!error) {
            setIsAuthenticated(true);
            setUser(JSON.parse(localStorage.getItem('user')));
            setCurrentPage('dashboard');
            showNotification('Login successful!', 'success');
        } else {
            showNotification(error);
        }
    };

    // Handle register success or error
    const handleRegister = (error) => {
        if (!error) {
            setIsAuthenticated(true);
            setUser(JSON.parse(localStorage.getItem('user')));
            setCurrentPage('dashboard');
            showNotification('Registration successful!', 'success');
        } else {
            showNotification(error);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        setCurrentPage('login');
        showNotification('Logged out successfully', 'success');
    };

    // SPA page switcher for sidebar
    const handlePageSwitch = (page) => {
        setCurrentPage(page);
        setNotification(null);
    };

    // Render auth pages if not authenticated
    if (!isAuthenticated) {
        if (currentPage === 'register') {
            return <Register onSwitch={() => { setCurrentPage('login'); setNotification(null); }} onRegister={handleRegister} notification={notification?.message} />;
        }
        return <Login onSwitch={() => { setCurrentPage('register'); setNotification(null); }} onLogin={handleLogin} notification={notification?.message} />;
    }

    // Main app layout for authenticated users
    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="sidebar bg-dark" style={{ width: '250px', minHeight: '100vh' }}>
                <div className="p-3">
                    <h4 className="text-white">Supply Chain</h4>
                </div>
                <nav className="nav flex-column">
                    <a className={`nav-link text-white ${currentPage === 'dashboard' ? 'active bg-primary' : ''}`} 
                       href="#" onClick={() => handlePageSwitch('dashboard')}>
                       <i className="bi bi-speedometer2 me-2"></i> Dashboard
                    </a>
                    <a className={`nav-link text-white ${currentPage === 'products' ? 'active bg-primary' : ''}`} 
                       href="#" onClick={() => handlePageSwitch('products')}>
                       <i className="bi bi-box-seam me-2"></i> Products
                    </a>
                    <a className={`nav-link text-white ${currentPage === 'inventory' ? 'active bg-primary' : ''}`} 
                       href="#" onClick={() => handlePageSwitch('inventory')}>
                       <i className="bi bi-archive me-2"></i> Inventory
                    </a>
                    <a className={`nav-link text-white ${currentPage === 'suppliers' ? 'active bg-primary' : ''}`} 
                       href="#" onClick={() => handlePageSwitch('suppliers')}>
                       <i className="bi bi-truck me-2"></i> Suppliers
                    </a>
                    <a className={`nav-link text-white ${currentPage === 'orders' ? 'active bg-primary' : ''}`} 
                       href="#" onClick={() => handlePageSwitch('orders')}>
                       <i className="bi bi-cart me-2"></i> Orders
                    </a>
                    <a className={`nav-link text-white ${currentPage === 'users' ? 'active bg-primary' : ''}`} 
                       href="#" onClick={() => handlePageSwitch('users')}>
                       <i className="bi bi-people me-2"></i> Users
                    </a>
                </nav>
            </div>
            {/* Main Content */}
            <div className="flex-grow-1">
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <div className="container-fluid">
                        <h1 className="h3 mb-0 text-gray-800">Supply Chain Management</h1>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                    <i className="bi bi-person-circle me-2"></i>
                                    {user?.username}
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <a className="dropdown-item" href="#" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="container-fluid">
                    {notification && (
                        <div className={`alert alert-${notification.type}`} role="alert">
                            {notification.message}
                        </div>
                    )}
                    {currentPage === 'dashboard' && <Dashboard showNotification={showNotification} />}
                    {currentPage === 'products' && <Products showNotification={showNotification} />}
                    {currentPage === 'inventory' && <Inventory showNotification={showNotification} />}
                    {currentPage === 'suppliers' && <Suppliers showNotification={showNotification} />}
                    {currentPage === 'orders' && <Orders showNotification={showNotification} />}
                    {currentPage === 'users' && <Users showNotification={showNotification} />}
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root')); 