# PTC Website - Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the PTC Website to various hosting platforms and environments.

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All HTML files validate (W3C Validator)
- [ ] CSS files are optimized and minified
- [ ] JavaScript functionality tested
- [ ] All links work correctly
- [ ] Images are optimized
- [ ] SEO meta tags are complete
- [ ] Mobile responsiveness verified

### ✅ Content Review
- [ ] All product data is accurate
- [ ] Contact information is current
- [ ] WhatsApp number is correct
- [ ] Brand logos are up-to-date
- [ ] Category pages display correctly
- [ ] Search functionality works

### ✅ Performance
- [ ] Page load times are acceptable
- [ ] Images are compressed
- [ ] CSS and JS are minified
- [ ] Database file is optimized
- [ ] No broken links

## 🌐 Hosting Options

### 1. Shared Hosting (Recommended for Small-Medium Sites)

#### cPanel Hosting
1. **Upload Files**
   ```bash
   # Upload via FTP/SFTP
   ftp your-domain.com
   # Upload all files to public_html/
   ```

2. **File Structure on Server**
   ```
   public_html/
   ├── index.html
   ├── assets/
   ├── pages/
   └── database/
   ```

3. **Configuration**
   - Set default document to `index.html`
   - Enable gzip compression
   - Set up SSL certificate
   - Configure caching headers

#### Popular Shared Hosting Providers
- **Hostinger**: Good performance, easy setup
- **Bluehost**: Reliable, good support
- **SiteGround**: Excellent performance
- **A2 Hosting**: Fast servers

### 2. VPS Hosting (For Better Performance)

#### Ubuntu/Debian Setup
```bash
# Update system
sudo apt update && sudo apt upgrade

# Install Nginx
sudo apt install nginx

# Install SSL certificate
sudo apt install certbot python3-certbot-nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/ptc-website

# Enable site
sudo ln -s /etc/nginx/sites-available/ptc-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/ptc-website;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle HTML files
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public";
    }

    # Main location block
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 3. Cloud Hosting (Scalable Solution)

#### AWS S3 + CloudFront
1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://ptc-website
   aws s3 website s3://ptc-website --index-document index.html
   ```

2. **Upload Files**
   ```bash
   aws s3 sync PTC_Website_Complete/ s3://ptc-website --delete
   ```

3. **Configure CloudFront**
   - Create distribution
   - Set S3 bucket as origin
   - Configure caching behavior
   - Set up custom domain

#### Google Cloud Storage
```bash
# Create bucket
gsutil mb gs://ptc-website

# Upload files
gsutil -m cp -r PTC_Website_Complete/* gs://ptc-website/

# Make bucket public
gsutil iam ch allUsers:objectViewer gs://ptc-website
```

## 🔧 Domain Configuration

### DNS Setup
```bash
# A Record (for root domain)
your-domain.com.    A    YOUR_SERVER_IP

# CNAME Record (for www subdomain)
www.your-domain.com.    CNAME    your-domain.com.

# MX Record (for email)
your-domain.com.    MX    10    mail.your-domain.com.
```

### SSL Certificate
```bash
# Let's Encrypt (free)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Performance Optimization

### Image Optimization
```bash
# Install ImageOptim (Mac) or similar
# Compress all images before upload

# WebP conversion
cwebp -q 80 image.jpg -o image.webp

# Responsive images
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Description">
</picture>
```

### Caching Strategy
```nginx
# Browser caching
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public";
}
```

### CDN Configuration
```javascript
// CloudFlare or similar CDN
// Enable:
// - Auto minify (HTML, CSS, JS)
// - Brotli compression
// - Rocket Loader
// - Always Online
```

## 🔍 Post-Deployment Testing

### Functionality Testing
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Search functionality works
- [ ] Product pages display properly
- [ ] Contact forms submit correctly
- [ ] WhatsApp integration works
- [ ] Mobile responsiveness verified

### Performance Testing
```bash
# PageSpeed Insights
https://pagespeed.web.dev/

# GTmetrix
https://gtmetrix.com/

# WebPageTest
https://www.webpagetest.org/
```

### SEO Testing
- [ ] Meta tags are present
- [ ] Structured data is valid
- [ ] Sitemap is accessible
- [ ] Robots.txt is configured
- [ ] Google Search Console setup

## 📈 Monitoring & Analytics

### Google Analytics Setup
```html
<!-- Add to all pages -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Google Search Console
1. Add property to Search Console
2. Verify ownership
3. Submit sitemap
4. Monitor performance

### Uptime Monitoring
```bash
# Set up monitoring with:
# - UptimeRobot (free)
# - Pingdom
# - StatusCake
```

## 🔒 Security Measures

### Security Headers
```nginx
# Add to Nginx config
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### File Permissions
```bash
# Set correct permissions
chmod 644 *.html
chmod 644 assets/css/*
chmod 644 assets/js/*
chmod 755 assets/images/
chmod 755 assets/logos/
```

### Backup Strategy
```bash
# Automated backups
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_$DATE.tar.gz /var/www/ptc-website/
aws s3 cp backup_$DATE.tar.gz s3://backup-bucket/
```

## 🚨 Troubleshooting

### Common Issues

#### 404 Errors
```bash
# Check file permissions
ls -la /var/www/ptc-website/

# Check Nginx configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

#### Slow Loading
```bash
# Check server resources
htop
df -h
free -h

# Optimize database
# Compress images
# Enable caching
```

#### SSL Issues
```bash
# Check certificate
openssl s_client -connect your-domain.com:443

# Renew certificate
sudo certbot renew
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- [ ] Weekly: Check for broken links
- [ ] Monthly: Update product database
- [ ] Quarterly: Performance audit
- [ ] Annually: Security review

### Contact Information
- **Technical Support**: development@ptc.com
- **Content Updates**: content@ptc.com
- **Emergency**: +91-98210-37990

---

**Last Updated**: December 2024
**Version**: 1.0
**Next Review**: January 2025


