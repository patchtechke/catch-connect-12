# Deployment Instructions

This document outlines the general steps to deploy your React application (built with Vite) to a production server. The specific steps might vary depending on your hosting provider and server setup.

## 1. Build the Application

First, you need to create a production-ready build of your application. This will compile your React code, optimize assets, and generate static files that can be served by any web server.

```bash
npm run build
```

This command will create a `dist` directory in your project root, containing all the static files (HTML, CSS, JavaScript, images, etc.) required to run your application.

## 2. Choose a Hosting Provider / Server

There are many options for hosting a static React application:

*   **Static Site Hosting (e.g., Netlify, Vercel, GitHub Pages, Firebase Hosting):** These services are designed for static sites and often provide easy deployment, CDN, and SSL out of the box.
*   **Traditional Web Servers (e.g., Nginx, Apache):** You can deploy your `dist` folder to a traditional web server.
*   **Cloud Platforms (e.g., AWS S3 + CloudFront, Google Cloud Storage, Azure Blob Storage):** For scalable and robust static site hosting.
*   **Node.js Server (e.g., Express.js):** If your application has a backend, you can serve the static files from your Node.js server.

## 3. Deploy the `dist` Folder

### Option A: Static Site Hosting (Recommended for simplicity)

Most static site hosts have a command-line interface (CLI) or a direct integration with your Git repository. You typically connect your repository, and the service automatically builds and deploys your application on every push to a specified branch.

Refer to your chosen provider's documentation for specific instructions:
*   [Netlify Deployment](https://docs.netlify.com/)
*   [Vercel Deployment](https://vercel.com/docs)
*   [GitHub Pages Deployment](https://docs.github.com/en/pages/)

### Option B: Traditional Web Server (e.g., Nginx)

1.  **Transfer Files:** Copy the contents of your local `dist` folder to your server's web root directory (e.g., `/var/www/html` for Nginx/Apache).

    You can use `scp` (Secure Copy Protocol) or `rsync` for this:
    ```bash
    scp -r ./dist/* user@your_server_ip:/var/www/html/your_app_directory/
    ```

2.  **Configure Web Server:** Configure your web server (Nginx, Apache) to serve the static files from the directory where you copied them. You'll also need to configure it to handle client-side routing (e.g., for React Router) by redirecting all unknown paths to your `index.html`.

    **Example Nginx Configuration (simplified):**
    ```nginx
    server {
        listen 80;
        server_name yourdomain.com;

        root /var/www/html/your_app_directory;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # Optional: Add caching headers for static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
            expires 1y;
            log_not_found off;
        }
    }
    ```

    After modifying the Nginx configuration, remember to test and reload it:
    ```bash
    sudo nginx -t
    sudo systemctl reload nginx
    ```

### Option C: Node.js Server (e.g., Express.js)

If you have a Node.js backend, you can serve the `dist` folder using Express's static middleware:

1.  **Install Express:**
    ```bash
    npm install express
    ```

2.  **Create a server file (e.g., `server.js`):**
    ```javascript
    const express = require('express');
    const path = require('path');
    const app = express();
    const port = process.env.PORT || 3000;

    // Serve static files from the 'dist' directory
    app.use(express.static(path.join(__dirname, 'dist')));

    // Handle client-side routing: serve index.html for all other routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    ```

3.  **Run the server:**
    ```bash
    node server.js
    ```

    For production, you would typically use a process manager like PM2 or a service like systemd to keep your Node.js server running.

## 4. Configure Environment Variables (if any)

If your application uses environment variables (e.g., API keys, backend URLs), ensure they are correctly configured for your production environment. For Vite, client-side environment variables are typically prefixed with `VITE_` and are embedded during the build process. Server-side environment variables (for Node.js backends) should be set on your server.

## 5. Set up SSL/TLS (HTTPS)

It's crucial to serve your application over HTTPS for security and SEO. You can obtain SSL certificates from providers like Let's Encrypt (free) and configure your web server or hosting provider to use them.

## 6. DNS Configuration

Update your domain's DNS records to point to your server's IP address or the URL provided by your static site host.

## 7. Monitoring and Maintenance

After deployment, monitor your application for errors and performance issues. Set up logging and error tracking to quickly identify and resolve any problems.