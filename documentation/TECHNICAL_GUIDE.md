# PTC Website - Technical Development Guide

## 🛠️ Development Environment

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime Text, etc.)
- Local web server (for development)
- Git (for version control)

### Local Development Setup
1. Clone or download the project
2. Set up a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

## 📁 File Structure & Organization

### Root Directory
```
PTC_Website_Complete/
├── index.html                    # Homepage (main entry point)
├── assets/                       # Static assets
├── pages/                        # All HTML pages
├── database/                     # Data files
└── documentation/                # Documentation
```

### Assets Organization
```
assets/
├── css/
│   ├── main.css                 # Primary stylesheet
│   └── styles.css               # Additional styles
├── js/                          # JavaScript files (if any)
├── images/                      # Image assets
└── logos/                       # Brand logos
```

### Pages Organization
```
pages/
├── categories/                   # Category pages (30+ files)
├── products/                    # Product pages (2497+ files)
├── volvo-categories.html        # Volvo brand page
└── scania-categories.html       # Scania brand page
```

## 🗄️ Database Management

### Database File: `new_partDatabase.js`
- **Location**: `database/new_partDatabase.js`
- **Format**: JavaScript array with JSON objects
- **Total Products**: 2,698
- **Size**: ~2MB

### Database Schema
```javascript
{
  "Part No": "20390836",                    // Unique identifier
  "Cleaned Description": "Hollow Spring",   // Product name
  "Application": "FMX480",                  // Compatible models
  "Brand": "Volvo",                        // Brand (Volvo/Scania)
  "Category": "Brake & Steering Systems",  // Product category
  "Alt Part No 1": "20535904",            // Alternate part numbers
  "Alt Part No 2": "20581399",
  "Alt Part No 3": "21024160",
  "Alt Part No 4": "21024164",
  "Alt Part No 5": "21024166",
  "Alt Part No 6": "",
  "Alt Part No 7": "",
  "Measurement (MXX)": "",                 // Product dimensions
  "OEM Part Nos": ""                       // OEM numbers
}
```

### Adding New Products
1. Open `database/new_partDatabase.js`
2. Add new product object to the array
3. Ensure all required fields are filled
4. Test the product page generation

### Database Validation
- All products must have a unique "Part No"
- "Brand" must be either "Volvo" or "Scania"
- "Category" must match one of the 9 main categories
- Empty fields should be empty strings, not null

## 🎨 CSS Architecture

### Main Stylesheets
- **`main.css`**: Primary styles, layout, components
- **`styles.css`**: Additional styles, utilities, overrides

### CSS Framework: Tailwind CSS
- **CDN**: `https://cdn.tailwindcss.com`
- **Customization**: Inline Tailwind config in HTML
- **Responsive**: Mobile-first approach

### Key CSS Classes Used
```css
/* Layout */
.container, .mx-auto, .px-4
/* Colors */
.bg-yellow-500, .text-gray-900, .text-white
/* Typography */
.text-3xl, .font-bold, .leading-relaxed
/* Spacing */
.mb-6, .p-6, .space-y-4
/* Effects */
.shadow-lg, .hover:shadow-xl, .transition-all
```

## 🔧 JavaScript Functionality

### Search Implementation
```javascript
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product["Part No"].toLowerCase().startsWith(searchTerm) ||
        product["Cleaned Description"].toLowerCase().startsWith(searchTerm) ||
        product["Brand"].toLowerCase().startsWith(searchTerm) ||
        product["Category"].toLowerCase().startsWith(searchTerm)
    );
}
```

### Product Filtering
```javascript
function filterProductsByCategoryAndBrand() {
    const targetBrand = "Volvo"; // or "Scania"
    const targetCategories = ["Engine Components"]; // Array of categories
    
    return products.filter(product => 
        product["Brand"] === targetBrand && 
        targetCategories.includes(product["Category"])
    );
}
```

### WhatsApp Integration
```javascript
function requestQuoteOnWhatsApp(partNo, description, brand, category, alternates) {
    const message = `Hi! I am interested in ${partNo} - ${description}. Please provide a quote.`;
    const whatsappUrl = `https://wa.me/919821037990?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Responsive Classes
```html
<!-- Mobile-first approach -->
<div class="w-full md:w-1/2 lg:w-1/3">
    <!-- Content -->
</div>

<!-- Responsive text -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">
    <!-- Heading -->
</h1>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Grid items -->
</div>
```

## 🔍 SEO Implementation

### Meta Tags Structure
```html
<title>Product Name | Category | Parts Trading Company</title>
<meta name="description" content="Product description with part number">
<meta name="keywords" content="relevant, keywords, for, search">
<meta property="og:title" content="Product Name">
<meta property="og:description" content="Product description">
<meta property="og:image" content="product-image.jpg">
```

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "mpn": "Part Number",
  "brand": {
    "@type": "Brand",
    "name": "Volvo"
  },
  "category": "Product Category",
  "description": "Product description"
}
```

## 🚀 Performance Optimization

### Image Optimization
- Use WebP format where possible
- Implement lazy loading
- Optimize image sizes
- Use appropriate alt tags

### CSS Optimization
- Minify CSS files
- Remove unused CSS
- Use efficient selectors
- Leverage CSS Grid and Flexbox

### JavaScript Optimization
- Minimize DOM queries
- Use event delegation
- Debounce search functions
- Lazy load non-critical scripts

## 🧪 Testing

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

### Functionality Testing
- Search functionality
- Product filtering
- Contact forms
- WhatsApp integration
- Responsive design
- SEO meta tags

### Performance Testing
- Page load times
- Search response times
- Mobile performance
- Core Web Vitals

## 🔄 Deployment

### Production Checklist
- [ ] Minify CSS and JavaScript
- [ ] Optimize images
- [ ] Update meta tags
- [ ] Test all functionality
- [ ] Validate HTML
- [ ] Check mobile responsiveness
- [ ] Test search functionality
- [ ] Verify contact forms

### File Structure for Production
```
production/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── logos/
├── pages/
│   ├── categories/
│   └── products/
└── database/
```

## 🐛 Common Issues & Solutions

### Search Not Working
- Check database file path
- Verify JavaScript console for errors
- Ensure database format is correct
- Test search function in browser console

### Styling Issues
- Clear browser cache
- Check CSS file paths
- Verify Tailwind CSS is loading
- Inspect element for conflicting styles

### Product Pages Not Loading
- Verify product file exists
- Check file naming convention
- Ensure database has product data
- Test direct URL access

### Mobile Responsiveness
- Test on actual devices
- Check viewport meta tag
- Verify responsive classes
- Test touch interactions

## 📈 Analytics & Monitoring

### Key Metrics to Track
- Page load times
- Search usage
- Product page views
- Contact form submissions
- WhatsApp clicks
- Mobile vs desktop usage

### Tools for Monitoring
- Google Analytics
- Google Search Console
- PageSpeed Insights
- Browser developer tools

## 🔐 Security Considerations

### Best Practices
- Validate all form inputs
- Sanitize search queries
- Use HTTPS in production
- Implement CSP headers
- Regular security updates

### Data Protection
- No sensitive data in client-side code
- Secure database access
- Regular backups
- GDPR compliance

## 📚 Additional Resources

### Documentation
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Alpine.js Documentation](https://alpinejs.dev/docs)
- [HTML5 Semantic Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

### Tools
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [W3C HTML Validator](https://validator.w3.org/)
- [CSS Validator](https://jigsaw.w3.org/css-validator/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Last Updated**: December 2024
**Version**: 1.0
**Maintained By**: Development Team


