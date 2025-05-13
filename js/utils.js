/**
 * Utility functions for the Supply Chain Management System
 */

// API endpoints
const API_ENDPOINTS = {
  products: '/api/products',
  inventory: '/api/inventory',
  suppliers: '/api/suppliers',
  orders: '/api/orders',
};

/**
 * Fetch data from API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Promise with JSON data
 */
async function fetchData(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    showNotification('Error fetching data. Please try again.', 'error');
    return null;
  }
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
  // Create notification element if it doesn't exist
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
      }
      .notification {
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 4px;
        color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        max-width: 500px;
        animation: slideIn 0.3s ease-out forwards;
      }
      .notification-success { background-color: #2ecc71; }
      .notification-error { background-color: #e74c3c; }
      .notification-warning { background-color: #f39c12; }
      .notification-info { background-color: #3498db; }
      .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        margin-left: 10px;
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'notification-close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    notification.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Append elements
  notification.appendChild(messageElement);
  notification.appendChild(closeButton);
  notificationContainer.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

/**
 * Format date
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (default: 'MM/DD/YYYY')
 * @returns {string} - Formatted date
 */
function formatDate(date, format = 'MM/DD/YYYY') {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  let formattedDate = format;
  formattedDate = formattedDate.replace('DD', day);
  formattedDate = formattedDate.replace('MM', month);
  formattedDate = formattedDate.replace('YYYY', year);
  
  return formattedDate;
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted currency
 */
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Validate form
 * @param {HTMLFormElement} form - Form to validate
 * @returns {boolean} - True if form is valid
 */
function validateForm(form) {
  const inputs = form.querySelectorAll('input, select, textarea');
  let isValid = true;
  
  inputs.forEach(input => {
    // Remove previous validation
    input.classList.remove('is-invalid');
    const feedbackElement = input.parentNode.querySelector('.invalid-feedback');
    if (feedbackElement) {
      feedbackElement.remove();
    }
    
    // Check required fields
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      showInputError(input, 'This field is required');
    }
    
    // Check email format
    if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value)) {
      isValid = false;
      showInputError(input, 'Please enter a valid email address');
    }
    
    // Check number fields
    if (input.type === 'number' && input.value.trim()) {
      const min = input.hasAttribute('min') ? parseFloat(input.getAttribute('min')) : null;
      const max = input.hasAttribute('max') ? parseFloat(input.getAttribute('max')) : null;
      const value = parseFloat(input.value);
      
      if (isNaN(value)) {
        isValid = false;
        showInputError(input, 'Please enter a valid number');
      } else if (min !== null && value < min) {
        isValid = false;
        showInputError(input, `Value must be greater than or equal to ${min}`);
      } else if (max !== null && value > max) {
        isValid = false;
        showInputError(input, `Value must be less than or equal to ${max}`);
      }
    }
  });
  
  return isValid;
}

/**
 * Show input error
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 */
function showInputError(input, message) {
  input.classList.add('is-invalid');
  
  const feedbackElement = document.createElement('div');
  feedbackElement.className = 'invalid-feedback';
  feedbackElement.textContent = message;
  
  input.parentNode.appendChild(feedbackElement);
}

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Set active sidebar item
 */
function setActiveSidebarItem() {
  const currentPath = window.location.pathname;
  const sidebarItems = document.querySelectorAll('.sidebar-menu a');
  
  sidebarItems.forEach(item => {
    const href = item.getAttribute('href');
    item.parentElement.classList.remove('active');
    
    if (href === currentPath || 
        (href === '/index.html' && (currentPath === '/' || currentPath === '/index.html')) ||
        (href !== '/index.html' && currentPath.includes(href))) {
      item.parentElement.classList.add('active');
    }
  });
}

/**
 * Initialize sidebar toggle for mobile
 */
function initSidebarToggle() {
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setActiveSidebarItem();
  initSidebarToggle();
});