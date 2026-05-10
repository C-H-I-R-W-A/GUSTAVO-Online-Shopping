// Product management for static ShopHub website

// Sample products data
const products = [
    {
        id: 1,
        name: 'Laptop',
        description: 'High-performance laptop with 16GB RAM, 512GB SSD, and Intel Core i7 processor. Perfect for work and gaming.',
        price: 3799962,
        stock_quantity: 10,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop&crop=center',
        is_active: true,
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        name: 'Smartphone',
        description: 'Latest smartphone model with 5G connectivity, 128GB storage, and advanced camera system.',
        price: 2659962,
        stock_quantity: 15,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop&crop=center',
        is_active: true,
        created_at: new Date().toISOString()
    },
    {
        id: 3,
        name: 'Headphones',
        description: 'Wireless noise-canceling headphones with 30-hour battery life and premium sound quality.',
        price: 569962,
        stock_quantity: 25,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop&crop=center',
        is_active: true,
        created_at: new Date().toISOString()
    },
    {
        id: 4,
        name: 'Smart Watch',
        description: 'Smart watch with fitness tracking, heart rate monitor, and smartphone integration.',
        price: 1139962,
        stock_quantity: 20,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop&crop=center',
        is_active: true,
        created_at: new Date().toISOString()
    },
    {
        id: 5,
        name: 'Backpack',
        description: 'Durable travel backpack with laptop compartment, USB charging port, and water-resistant material.',
        price: 189962,
        stock_quantity: 30,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop&crop=center',
        is_active: true,
        created_at: new Date().toISOString()
    },
    {
        id: 6,
        name: 'Tablet',
        description: '10-inch tablet with 64GB storage, perfect for entertainment and work on the go.',
        price: 1519962,
        stock_quantity: 12,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop&crop=center',
        is_active: true,
        created_at: new Date().toISOString()
    }
];

// Load and display products on the main page
function loadProducts() {
    const productsContainer = document.getElementById('productsContainer');
    const noProductsMessage = document.getElementById('noProductsMessage');
    
    if (!productsContainer) return;
    
    const activeProducts = products.filter(p => p.is_active);
    
    if (activeProducts.length === 0) {
        productsContainer.innerHTML = '';
        if (noProductsMessage) {
            noProductsMessage.style.display = 'block';
        }
        return;
    }
    
    if (noProductsMessage) {
        noProductsMessage.style.display = 'none';
    }
    
    let productsHtml = '';
    
    activeProducts.forEach(product => {
        productsHtml += `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">
                            <strong>Price: ${window.products.formatPrice(product.price)}</strong>
                        </p>
                        <p class="card-text">
                            <small class="text-muted">Stock: ${product.stock_quantity} units</small>
                        </p>
                        <span class="badge bg-secondary">${product.category}</span>
                    </div>
                    <div class="card-footer">
                        ${window.auth.isLoggedIn() 
                            ? `<button class="btn btn-primary btn-cart" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                               </button>`
                            : `<a href="login.html" class="btn btn-outline-primary">
                                <i class="fas fa-sign-in-alt"></i> Login to Buy
                               </a>`
                        }
                    </div>
                </div>
            </div>
        `;
    });
    
    productsContainer.innerHTML = productsHtml;
}

// Get product by ID
function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}

// Get all products
function getAllProducts() {
    return products.filter(p => p.is_active);
}

// Get products by category
function getProductsByCategory(category) {
    return products.filter(p => p.is_active && p.category === category);
}

// Search products
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(p => 
        p.is_active && (
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        )
    );
}

// Add product to cart (delegates to cart.js)
function addToCart(productId) {
    if (!window.auth.isLoggedIn()) {
        window.auth.flashMessage('Please log in to add items to cart.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    const product = getProductById(productId);
    if (!product) {
        window.auth.flashMessage('Product not found.', 'error');
        return;
    }
    
    if (product.stock_quantity <= 0) {
        window.auth.flashMessage('Product is out of stock.', 'error');
        return;
    }
    
    // Add to cart using cart.js function
    window.cart.addToCart(productId);
    
    // Show success message
    window.auth.flashMessage(`${product.name} added to cart!`, 'success');
}

// Display product details (for product detail page)
function displayProductDetails(productId) {
    const product = getProductById(productId);
    if (!product) {
        window.auth.flashMessage('Product not found.', 'error');
        return;
    }
    
    // This would be used on a product detail page
    // For now, redirect to cart if user wants to buy
    if (window.auth.isLoggedIn()) {
        addToCart(productId);
    } else {
        window.location.href = 'login.html';
    }
}

// Format price display
function formatPrice(price) {
    return `UGX ${parseFloat(price).toLocaleString()}`;
}

// Check if product is in stock
function isInStock(productId) {
    const product = getProductById(productId);
    return product && product.stock_quantity > 0;
}

// Get stock count for product
function getStockCount(productId) {
    const product = getProductById(productId);
    return product ? product.stock_quantity : 0;
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load products if we're on the main page
    if (document.getElementById('productsContainer')) {
        loadProducts();
    }
});

// Export functions for use in other scripts
window.products = {
    loadProducts,
    getProductById,
    getAllProducts,
    getProductsByCategory,
    searchProducts,
    addToCart,
    displayProductDetails,
    formatPrice,
    isInStock,
    getStockCount
};
