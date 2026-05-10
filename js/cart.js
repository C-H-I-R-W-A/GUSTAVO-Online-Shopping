// Shopping cart management for static ShopHub website

// Cart data structure
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add item to cart
function addToCart(productId, quantity = 1) {
    const product = window.products.getProductById(productId);
    if (!product) {
        window.auth.flashMessage('Product not found.', 'error');
        return false;
    }
    
    if (product.stock_quantity < quantity) {
        window.auth.flashMessage('Insufficient stock available.', 'error');
        return false;
    }
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        // Update quantity if item exists
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock_quantity) {
            window.auth.flashMessage('Cannot add more items than available stock.', 'error');
            return false;
        }
        existingItem.quantity = newQuantity;
    } else {
        // Add new item to cart
        cart.push({
            productId: productId,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart count display
    updateCartCount();
    
    return true;
}

// Remove item from cart
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.productId === productId);
    if (index > -1) {
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        return true;
    }
    return false;
}

// Update item quantity in cart
function updateQuantity(productId, newQuantity) {
    const product = window.products.getProductById(productId);
    if (!product) {
        return false;
    }
    
    if (newQuantity < 1) {
        return removeFromCart(productId);
    }
    
    if (newQuantity > product.stock_quantity) {
        window.auth.flashMessage('Cannot exceed available stock.', 'error');
        return false;
    }
    
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        return true;
    }
    
    return false;
}

// Get cart items with product details
function getCartItems() {
    return cart.map(item => {
        const product = window.products.getProductById(item.productId);
        return {
            ...item,
            product: product,
            totalPrice: product ? product.price * item.quantity : 0
        };
    }).filter(item => item.product); // Filter out items with invalid products
}

// Calculate cart total
function getCartTotal() {
    return getCartItems().reduce((total, item) => total + item.totalPrice, 0);
}

// Get cart item count
function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count display in navigation
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const count = getCartItemCount();
    
    cartCountElements.forEach(element => {
        if (count > 0) {
            element.textContent = count;
            element.style.display = 'inline-block';
        } else {
            element.style.display = 'none';
        }
    });
}

// Load and display cart on cart page
function loadCartPage() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const orderSummary = document.getElementById('order-summary');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;
    
    const cartItems = getCartItems();
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h4>Your cart is empty</h4>
                <p class="text-muted">Add some products to get started!</p>
                <a href="index.html" class="btn btn-primary">
                    <i class="fas fa-shopping-bag"></i> Continue Shopping
                </a>
            </div>
        `;
        
        if (cartSummary) cartSummary.style.display = 'none';
        if (orderSummary) orderSummary.innerHTML = '<p class="text-muted">Your cart is empty</p>';
        return;
    }
    
    // Display cart items
    let itemsHtml = '';
    cartItems.forEach(item => {
        itemsHtml += `
            <div class="cart-item d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom" data-product-id="${item.productId}">
                <div class="d-flex align-items-center">
                    <div class="me-3">
                        <img src="${item.product.image}" alt="${item.product.name}" class="product-image" style="width: 80px; height: 80px; object-fit: cover;">
                    </div>
                    <div>
                        <h6 class="mb-1">${item.product.name}</h6>
                        <small class="text-muted">${window.products.formatPrice(item.product.price)} each</small>
                        <br>
                        <small class="text-muted">Stock: ${item.product.stock_quantity} available</small>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <div class="input-group input-group-sm me-3" style="width: 120px;">
                        <button class="btn btn-outline-secondary" type="button" onclick="cart.updateQuantity(${item.productId}, ${item.quantity - 1})">-</button>
                        <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                        <button class="btn btn-outline-secondary" type="button" onclick="cart.updateQuantity(${item.productId}, ${item.quantity + 1})">+</button>
                    </div>
                    <div class="text-end">
                        <strong>${window.products.formatPrice(item.totalPrice)}</strong><br>
                        <button class="btn btn-sm btn-link text-danger p-0" onclick="cart.removeFromCart(${item.productId})">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHtml;
    
    // Update cart summary
    const subtotal = getCartTotal();
    const shipping = subtotal > 190000 ? 0 : 38000;
    const total = subtotal + shipping;
    
    if (cartSummary) cartSummary.style.display = 'block';
    if (cartTotal) cartTotal.textContent = window.products.formatPrice(total);
    
    if (orderSummary) {
        orderSummary.innerHTML = `
            <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${window.products.formatPrice(subtotal)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>${shipping === 0 ? 'FREE' : window.products.formatPrice(shipping)}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong class="text-primary">${window.products.formatPrice(total)}</strong>
            </div>
            ${shipping > 0 ? `<small class="text-success">Add ${window.products.formatPrice(190000 - subtotal)} more for free shipping!</small>` : ''}
        `;
    }
}

// Process checkout
function processCheckout(orderData) {
    if (!window.auth.isLoggedIn()) {
        window.auth.flashMessage('Please log in to checkout.', 'error');
        return false;
    }
    
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
        window.auth.flashMessage('Your cart is empty.', 'error');
        return false;
    }
    
    // Create order
    const order = {
        id: generateOrderId(),
        userId: window.auth.getCurrentUser().id,
        items: cartItems,
        subtotal: getCartTotal(),
        shipping: getCartTotal() > 190000 ? 0 : 38000,
        total: getCartTotal() + (getCartTotal() > 190000 ? 0 : 38000),
        shippingAddress: orderData.shippingAddress,
        shippingPhone: orderData.shippingPhone,
        status: 'Pending',
        paymentStatus: 'Pending',
        createdAt: new Date().toISOString()
    };
    
    // Save order to localStorage (in real app, this would be server-side)
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    clearCart();
    
    return order;
}

// Generate unique order ID
function generateOrderId() {
    return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Get user orders
function getUserOrders(userId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.filter(order => order.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Get all orders (for admin)
function getAllOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Load cart page if we're on the cart page
    if (document.getElementById('cart-items')) {
        loadCartPage();
    }
});

// Export functions for use in other scripts
window.cart = {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartItems,
    getCartTotal,
    getCartItemCount,
    clearCart,
    loadCartPage,
    processCheckout,
    getUserOrders,
    getAllOrders
};
