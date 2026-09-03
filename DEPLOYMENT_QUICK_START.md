# 🚀 BeatsPush - Complete Deployment Quick Start

## What You Need (5 Minutes Setup)

### 1. Gmail App Password (YOU HAVE THIS!)
- Go to: https://myaccount.google.com/apppasswords
- Generate password for "Mail"
- Copy 16-character password

### 2. Paystack Test Keys (FREE - 5 minutes)
- Sign up: https://dashboard.paystack.com/signup
- Verify your email
- Get keys: https://dashboard.paystack.com/#/settings/developers
- Copy `pk_test_...` (Public Key) and `sk_test_...` (Secret Key)
- **Supports:** NGN (Naira), USD, EUR, GBP, and more!

## 📦 Deploy Backend to Render (10 Minutes)

### Step 1: Create Render Account
1. Go to: https://render.com
2. Sign in with GitHub (beatpush329-afk)
3. Authorize Render

### Step 2: Deploy with Blueprint
1. Click **"New +"** → **"Blueprint"**
2. Select: `beatpush329-afk/beatpush`
3. Click **"Apply"**
4. Wait 5-10 minutes

### Step 3: Add Environment Variables
Go to your web service → **Environment** tab:

**MINIMUM REQUIRED:**
```bash
SECRET_KEY=test_secret_key_replace_this_min_32_characters_long_12345
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
PAYMENT_PROVIDER=paystack
DEFAULT_CURRENCY=NGN
SMTP_USER=beatpush329@gmail.com
SMTP_PASSWORD=your_16_char_gmail_app_password
ENVIRONMENT=production
DEBUG=False
```

**OPTIONAL (Can add later):**
```bash
AWS_ACCESS_KEY_ID=your_r2_key
AWS_SECRET_ACCESS_KEY=your_r2_secret
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
R2_BUCKET_NAME=beatpush-uploads
```

### Step 4: Run Migrations
In Render Shell:
```bash
cd backend
alembic upgrade head
```

### Step 5: Get Your Backend URL
Copy: `https://beatpush-backend.onrender.com`

---

## 🌐 Deploy Frontend to Netlify (5 Minutes)

### Step 1: Create Netlify Account
1. Go to: https://netlify.com
2. Sign in with GitHub (beatpush329-afk)
3. Authorize Netlify

### Step 2: Create Site
1. Click **"Add new site"** → **"Import from Git"**
2. Choose **GitHub**
3. Select: `beatpush329-afk/beatpush`

### Step 3: Configure Build
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/.next
```

Click **"Deploy site"**

### Step 4: Add Environment Variables
Site settings → Environment variables:

```bash
NEXT_PUBLIC_API_URL=https://beatpush-backend.onrender.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
NEXT_PUBLIC_PAYMENT_PROVIDER=paystack
NEXT_PUBLIC_DEFAULT_CURRENCY=NGN
NEXT_PUBLIC_APP_NAME=BeatsPush
```

### Step 5: Redeploy
Deploys → Trigger deploy

### Step 6: Get Your Frontend URL
Copy: `https://your-site.netlify.app`

---

## 🔗 Connect Frontend & Backend

### Update Backend CORS
In Render → Environment variables:

```bash
FRONTEND_URL=https://your-site.netlify.app
ALLOWED_ORIGINS=https://your-site.netlify.app
```

Redeploy backend.

---

## ✅ Test Your Deployment

### Test Backend
1. Visit: `https://beatpush-backend.onrender.com/docs`
2. You should see API documentation
3. Try the health check endpoint

### Test Frontend
1. Visit: `https://your-site.netlify.app`
2. Try registering a test account
3. Try logging in
4. Try uploading a test beat

---

## 📋 Environment Variables Reference

### Backend (.env)
```bash
# Security
SECRET_KEY=<generate_with: python -c "import secrets; print(secrets.token_urlsafe(32))">
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database (auto-configured by Render)
DATABASE_URL=postgresql://...

# Redis (auto-configured by Render)
REDIS_URL=redis://...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=beatpush329@gmail.com
SMTP_PASSWORD=<your_gmail_app_password>

# Payment
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
PAYMENT_PROVIDER=paystack
DEFAULT_CURRENCY=NGN

# CORS
FRONTEND_URL=https://your-site.netlify.app
ALLOWED_ORIGINS=https://your-site.netlify.app

# Application
ENVIRONMENT=production
DEBUG=False
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://beatpush-backend.onrender.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_PAYMENT_PROVIDER=paystack
NEXT_PUBLIC_DEFAULT_CURRENCY=NGN
NEXT_PUBLIC_APP_NAME=BeatsPush
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_MESSAGING=true
```

---

## 🆘 Common Issues

### Backend won't start
- ✅ Check `SECRET_KEY` is set
- ✅ Check `DATABASE_URL` is configured
- ✅ View logs for errors

### Frontend can't connect to backend
- ✅ Check `NEXT_PUBLIC_API_URL` is correct
- ✅ Check CORS settings on backend
- ✅ Verify backend is running

### Database errors
- ✅ Run migrations: `alembic upgrade head`
- ✅ Check database is created
- ✅ Verify connection string

---

## 📚 Full Documentation

- **Backend Deployment:** `RENDER_DEPLOYMENT_GUIDE.md`
- **Frontend Deployment:** `NETLIFY_DEPLOYMENT_GUIDE.md`
- **Get API Keys:** `GET_FREE_API_KEYS_GUIDE.md`
- **Environment Variables:** `backend/.env.testing`

---

## 🎉 You're Live!

**Frontend:** https://your-site.netlify.app
**Backend:** https://beatpush-backend.onrender.com
**API Docs:** https://beatpush-backend.onrender.com/docs

### Next Steps:
1. ✅ Test all features
2. ✅ Add more API keys (R2, OpenAI, etc.)
3. ✅ Custom domain (optional)
4. ✅ Monitor logs
5. ✅ Start using!

---

## 💰 Costs

### Free Tier (What You Get)
- **Render Backend:** FREE (750 hours/month)
- **PostgreSQL:** FREE (256MB)
- **Redis:** FREE (25MB)
- **Netlify Frontend:** FREE (100GB bandwidth)
- **Stripe:** FREE (test mode)
- **Gmail SMTP:** FREE

**Total: $0/month** 🎉

### Future Upgrades (Optional)
- Render Pro: $7/month (no cold starts)
- Netlify Pro: $19/month (more bandwidth)
- Custom domain: $10-15/year

---

**Repository:** https://github.com/beatpush329-afk/beatpush
**Ready to launch!** 🚀
