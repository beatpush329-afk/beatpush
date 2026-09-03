# 🚀 BeatsPush Frontend - Netlify Deployment Guide

## Quick Deploy (5 Minutes)

### 1. Sign Up / Log In to Netlify
1. Go to https://netlify.com
2. Sign up with GitHub (use beatpush329-afk account)
3. Authorize Netlify to access your repositories

### 2. Create New Site
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select repository: `beatpush329-afk/beatpush`
4. Configure build settings:

```yaml
Base directory: frontend
Build command: npm run build
Publish directory: frontend/.next
```

5. Click **"Deploy site"**

### 3. Configure Environment Variables
Go to: **Site settings** → **Environment variables** → **Add a variable**

Add these variables:

```bash
# Backend API (Update after Render deployment)
NEXT_PUBLIC_API_URL=http://localhost:8000

# WebSocket URL
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# App Info
NEXT_PUBLIC_APP_NAME=BeatsPush
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app

# Payment (Use test keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
# OR
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here

NEXT_PUBLIC_PAYMENT_PROVIDER=stripe

# Features
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_MESSAGING=true
```

### 4. Update Site Name (Optional)
1. Go to **Site settings** → **Site details**
2. Click **"Change site name"**
3. Choose: `beatpush` or `beatpush-app`
4. Your URL becomes: `https://beatpush.netlify.app`

### 5. Link Backend URL
After your backend is deployed on Render:

1. Go to Netlify → **Environment variables**
2. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://beatpush-backend.onrender.com
   ```
3. Update `NEXT_PUBLIC_WS_URL`:
   ```
   NEXT_PUBLIC_WS_URL=wss://beatpush-backend.onrender.com
   ```
4. Click **"Save"**
5. Go to **Deploys** → **Trigger deploy** → **Deploy site**

### 6. Update Backend CORS
After frontend is deployed, update your Render backend environment variables:

```bash
FRONTEND_URL=https://beatpush.netlify.app
ALLOWED_ORIGINS=https://beatpush.netlify.app,https://www.beatpush.netlify.app
```

### 7. Test Your Site
1. Visit: `https://your-site.netlify.app`
2. Try registering a test account
3. Test login/logout
4. Upload a test beat/track

## 📋 Complete Environment Variables

### Required (Minimum to run):
```bash
NEXT_PUBLIC_API_URL=https://beatpush-backend.onrender.com
NEXT_PUBLIC_APP_URL=https://beatpush.netlify.app
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Recommended:
```bash
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_MESSAGING=true
NEXT_PUBLIC_ENABLE_LIVE_STREAMING=true
NEXT_PUBLIC_ENABLE_FAN_CLUBS=true
NEXT_PUBLIC_TURNSTILE_ENABLED=false
```

### Optional (Add later):
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_SENTRY_DSN=...
```

## 🔧 Custom Domain Setup (Optional)

### Add Your Domain
1. Purchase domain (e.g., beatpush.com)
2. Go to Netlify → **Domain management** → **Add custom domain**
3. Enter: `beatpush.com` and `www.beatpush.com`
4. Netlify provides DNS records

### Update DNS
Add these records at your domain registrar:

```
A     @     75.2.60.5
CNAME www   your-site.netlify.app
```

### Enable HTTPS (Automatic)
- Netlify auto-provisions SSL certificate
- Force HTTPS redirect in settings

## 📊 Netlify Features

### Automatic Deployments
- Every push to `main` branch auto-deploys
- Preview deployments for pull requests

### Deploy Previews
- Test changes before merging
- Each PR gets unique URL

### Forms (Built-in)
- Contact forms without backend
- Add `netlify` attribute to forms

### Functions (Serverless)
- Create API endpoints in `/functions` directory
- No server management needed

## ⚙️ Build Settings

### next.config.js (Already configured)
```javascript
module.exports = {
  output: 'standalone',
  images: {
    domains: ['uploads.beatpush.com'],
  },
}
```

### netlify.toml (Already created)
Located at: `frontend/netlify.toml`

## 🔍 Troubleshooting

### Build Fails
**Check Node version:**
```bash
# In Netlify environment variables
NODE_VERSION=18.17.0
```

**Clear cache and retry:**
- Deploy settings → **Clear cache and deploy site**

### API Connection Fails
**Check CORS on backend:**
- Verify `ALLOWED_ORIGINS` includes your Netlify URL
- Check `FRONTEND_URL` is set correctly

**Check environment variables:**
- Ensure `NEXT_PUBLIC_API_URL` is correct
- No trailing slash in URL

### Images Not Loading
**Update next.config.js:**
```javascript
images: {
  domains: [
    'uploads.beatpush.com',
    'your-bucket.r2.cloudflarestorage.com'
  ],
}
```

### 404 Errors on Page Refresh
**Already handled in netlify.toml:**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📈 Performance Optimization

### Enable Caching
Already configured in `netlify.toml`:
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Image Optimization
- Use Next.js Image component
- Images auto-optimized by Netlify

### Bundle Analysis
```bash
npm run build
# Check .next folder size
```

## 🔐 Security Headers

Already configured in `netlify.toml`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block

## 💰 Pricing

### Free Tier Includes:
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ HTTPS included
- ✅ Custom domain
- ✅ Deploy previews
- ✅ Forms (100 submissions/month)
- ✅ Serverless functions (125k requests/month)

### Pro Plan ($19/month):
- 1TB bandwidth
- Unlimited build minutes
- Password protection
- Advanced analytics

## 🔄 Update Deployment

### Manual Deploy
1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```
2. Netlify auto-deploys in 2-5 minutes

### Rollback
1. Go to **Deploys**
2. Find previous deploy
3. Click **"Publish deploy"**

## 📱 Progressive Web App (PWA)

Add to next.config.js:
```javascript
const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA({
  // existing config
})
```

## 🌐 CDN & Performance

- **Global CDN:** Content served from 100+ locations
- **Edge optimization:** Automatic
- **Compression:** Brotli & Gzip enabled
- **HTTP/3:** Enabled by default

## 📞 Support

- **Netlify Docs:** https://docs.netlify.com
- **Community Forum:** https://answers.netlify.com
- **Status:** https://www.netlifystatus.com

## ✅ Deployment Checklist

- [ ] Site created on Netlify
- [ ] Environment variables added
- [ ] Backend URL configured
- [ ] CORS updated on backend
- [ ] Custom domain added (optional)
- [ ] SSL certificate active
- [ ] Test all features
- [ ] Monitor first deployment

## 🎉 You're Live!

After deployment:
- **Frontend:** https://your-site.netlify.app
- **Backend:** https://beatpush-backend.onrender.com
- **Docs:** https://beatpush-backend.onrender.com/docs

Start promoting your platform! 🚀
