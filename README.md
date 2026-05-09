# ShopHub - Static E-commerce Website

A modern, fully-functional e-commerce website built with HTML, CSS, and JavaScript, ready for deployment on GitHub Pages. This static version replicates the functionality of the original Flask-based shopping system with client-side storage and management.

## Features

### 🛍️ **Shopping Features**
- **Product Catalog**: Browse products with categories, prices, and stock information
- **Shopping Cart**: Add/remove items, update quantities with localStorage persistence
- **Checkout Process**: Complete order placement with shipping information
- **Payment Integration**: Support for M-Pesa, Bank Transfer, and Card payments
- **Order Management**: Track orders, view order history and status updates

### 👤 **User Management**
- **Customer Accounts**: Registration and login system with form validation
- **User Dashboards**: Personal dashboard for customers with order tracking
- **Admin Panel**: Administrative interface for payment verification and order management
- **Role-based Access**: Separate interfaces for customers and administrators

### 🎨 **Design & UX**
- **Responsive Design**: Mobile-friendly layout using Bootstrap 5
- **Modern UI**: Clean, professional interface with Font Awesome icons
- **Interactive Elements**: Smooth animations, hover effects, and transitions
- **Real-time Updates**: Dynamic content updates without page refreshes

### 💾 **Data Storage**
- **Client-side Storage**: Uses localStorage for data persistence
- **No Backend Required**: Fully functional without server-side dependencies
- **Data Management**: Orders, users, and payments stored locally
- **Admin Functions**: Complete order and payment management capabilities

## Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- GitHub account (for deployment)
- Git installed (optional, for local development)

### Local Development
1. **Clone or Download** this repository
2. **Open** `index.html` in your web browser
3. **Start Shopping!** No installation required

### Default Admin Account
- **Username**: `admin`
- **Password**: `admin123`

## Deployment on GitHub Pages

### Method 1: Direct Upload
1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select source as "Deploy from a branch"
5. Choose main branch and `/ (root)` folder
6. Click "Save" and wait for deployment

### Method 2: Git Workflow
```bash
# Clone the repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Add all files
git add .
git commit -m "Initial commit"
git push origin main

# Enable GitHub Pages in repository settings
```

### Method 3: GitHub Desktop
1. Open GitHub Desktop
2. Clone or create repository
3. Copy all project files to repository folder
4. Commit and push changes
5. Enable GitHub Pages in repository settings

## File Structure

```
online-shopping-2/
├── index.html                 # Homepage with product listings
├── login.html                 # User login page
├── register.html              # User registration page
├── cart.html                  # Shopping cart page
├── checkout.html              # Checkout process
├── order-confirmation.html    # Order confirmation page
├── payment-confirmation.html  # Payment confirmation page
├── dashboard.html             # User/admin dashboard
├── admin-payment-verification.html  # Admin payment verification
├── admin-orders.html          # Admin order management
├── css/
│   └── style.css              # Custom styles
├── js/
│   ├── auth.js                # Authentication management
│   ├── products.js            # Product management
│   └── cart.js                # Shopping cart functionality
└── README.md                  # This file
```

## Usage Guide

### For Customers
1. **Register**: Create an account with email and password
2. **Browse**: View products on the homepage
3. **Add to Cart**: Click "Add to Cart" on desired products
4. **Checkout**: Proceed to checkout and fill shipping details
5. **Payment**: Complete payment using preferred method
6. **Track**: Monitor order status in dashboard

### For Administrators
1. **Login**: Use admin credentials to access admin panel
2. **Verify Payments**: Review and approve/reject payment confirmations
3. **Manage Orders**: Update order statuses and view order details
4. **Track Revenue**: Monitor sales and payment status
5. **Customer Support**: Access customer information for support

## Customization

### Adding Products
Edit `js/products.js` to modify the product catalog:
```javascript
const products = [
    {
        id: 1,
        name: 'Product Name',
        description: 'Product description',
        price: 99.99,
        stock_quantity: 10,
        category: 'Electronics',
        image: 'image-url',
        is_active: true
    }
];
```

### Styling
- Modify `css/style.css` for custom styling
- Bootstrap 5 classes can be used throughout
- Font Awesome icons for visual elements

### Business Information
Update contact details and business information in:
- Navigation footer
- Contact support sections
- Payment instructions

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## Security Notes

⚠️ **Important**: This is a demonstration website with client-side storage. For production use:

1. **Implement Backend**: Replace localStorage with proper database
2. **Add Authentication**: Use secure server-side authentication
3. **Payment Gateway**: Integrate with real payment providers
4. **HTTPS**: Ensure SSL certificate is installed
5. **Data Validation**: Add server-side validation
6. **Rate Limiting**: Implement API rate limiting

## Features Not Included

For simplicity, some advanced features are omitted:
- Email notifications
- Real inventory management
- Advanced search and filtering
- Product reviews and ratings
- Wishlist functionality
- Multi-language support
- Currency conversion

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes and test thoroughly
4. Submit pull request

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check existing issues for solutions
- Review documentation for common problems

## License

This project is open source and available under the [MIT License](LICENSE).

## Demo

A live demo of this website is available at: `https://yourusername.github.io/your-repo/`

---

**Built with ❤️ using HTML, CSS, and JavaScript**
