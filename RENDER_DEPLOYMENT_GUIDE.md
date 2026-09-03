# BeatsPush Backend Deployment to Render

## Prerequisites
- GitHub account with repository: https://github.com/beatpush329-afk/beatpush
- Render account (sign up at https://render.com)
- All environment variables ready

## Step-by-Step Deployment

### 1. Sign Up / Log In to Render
1. Go to https://render.com
2. Sign up or log in with your GitHub account (beatpush329-afk)
3. Authorize Render to access your GitHub repositories

### 2. Create a New Web Service

#### Option A: Using Blueprint (Automated - Recommended)
1. Click **"New +"** → **"Blueprint"**
2. Connect your repository: `beatpush329-afk/beatpush`
3. Render will detect `render.yaml` and auto-configure everything
4. Click **"Apply"**
5. Skip to Step 4

#### Option B: Manual Setup
1. Click **"New +"** → **"Web Service"**
2. Connect your repository: `beatpush329-afk/beatpush`
3. Configure the service:
   - **Name:** `beatpush-backend`
   - **Region:** Oregon (US West) or closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free

### 3. Create PostgreSQL Database
1. Click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name:** `beatpush-db`
   - **Database:** `beatpush`
   - **Region:** Same as your web service (Oregon)
   - **Plan:** Free
3. Click **"Create Database"**
4. Wait for database to be ready
5. Copy the **Internal Database URL**

### 4. Create Redis Instance
1. Click **"New +"** → **"Redis"**
2. Configure:
   - **Name:** `beatpush-redis`
   - **Region:** Same as your web service
   - **Plan:** Free
3. Click **"Create Redis"**
4. Copy the **Internal Redis URL**

### 5. Configure Environment Variables
Go to your web service → **Environment** tab and add:

#### Required Variables:
```bash
# Database
DATABASE_URL=<paste_internal_postgres_url>

# Security
SECRET_KEY=<generate_random_string_min_32_chars>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis
REDIS_URL=<paste_internal_redis_url>

# Application
ENVIRONMENT=production
DEBUG=False

# CORS
FRONTEND_URL=https://your-frontend-url.vercel.app
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app,https://beatpush.com

# Stripe (Payment)
STRIPE_SECRET_KEY=<your_stripe_secret_key>
STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>

# Paystack (Alternative Payment)
PAYSTACK_SECRET_KEY=<your_paystack_secret_key>
PAYSTACK_PUBLIC_KEY=<your_paystack_public_key>

# Email (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your_email>
SMTP_PASSWORD=<your_app_password>

# Cloudflare R2 / AWS S3 (File Storage)
AWS_ACCESS_KEY_ID=<your_r2_access_key>
AWS_SECRET_ACCESS_KEY=<your_r2_secret_key>
R2_ENDPOINT=<your_r2_endpoint_url>
R2_BUCKET_NAME=beatpush-uploads

# AI (OpenAI)
OPENAI_API_KEY=<your_openai_api_key>

# SMS (Optional - Twilio)
TWILIO_ACCOUNT_SID=<your_twilio_sid>
TWILIO_AUTH_TOKEN=<your_twilio_token>
TWILIO_PHONE_NUMBER=<your_twilio_phone>
```

### 6. Run Database Migrations
After deployment, you need to run migrations:

#### Option 1: Using Render Shell
1. Go to your web service
2. Click **"Shell"** tab
3. Run:
```bash
cd backend
alembic upgrade head
```

#### Option 2: Add to Build Command
Update build command to:
```bash
pip install -r requirements.txt && alembic upgrade head
```

### 7. Verify Deployment
1. Wait for deployment to complete (5-10 minutes)
2. Click on your service URL (e.g., `https://beatpush-backend.onrender.com`)
3. You should see the API docs at: `https://beatpush-backend.onrender.com/docs`
4. Test the health endpoint: `https://beatpush-backend.onrender.com/`

### 8. Post-Deployment Setup

#### Create Admin User
Use the Render Shell:
```bash
python create_admin_user.py
```

#### Verify Database Tables
```bash
python check_db.py
```

## Important Notes

### Free Tier Limitations
- **Spin down after 15 minutes of inactivity**
- Cold starts take 30-60 seconds
- 750 hours/month free
- Consider upgrading to paid plan for production

### Database Backups
- Free PostgreSQL has 7-day retention
- Upgrade to paid plan for longer retention

### Environment Variables Security
- Never commit `.env` files
- Use Render's built-in secret management
- Rotate keys regularly

### Monitoring
- Enable Render's built-in metrics
- Set up health check endpoint
- Monitor logs regularly

## Troubleshooting

### Common Issues

**1. Build Fails**
- Check Python version in `runtime.txt` (should be 3.11.0)
- Verify all dependencies in `requirements.txt`
- Check build logs for specific errors

**2. Database Connection Fails**
- Verify `DATABASE_URL` is set correctly
- Use internal database URL (faster, free)
- Check if database is running

**3. Redis Connection Fails**
- Verify `REDIS_URL` is set
- Use internal Redis URL
- Check if Redis instance is running

**4. Application Won't Start**
- Check start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Verify `main.py` exists in backend directory
- Check application logs

**5. CORS Errors**
- Update `ALLOWED_ORIGINS` with your frontend URL
- Restart the service after updating env vars

## Update Deployment

To update your deployment:
```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will automatically detect changes and redeploy.

## Custom Domain (Optional)

1. Go to **Settings** → **Custom Domain**
2. Add your domain (e.g., `api.beatpush.com`)
3. Update DNS records as instructed
4. SSL certificate is automatic

## Scaling (Paid Plans)

For production, consider:
- **Starter Plan** ($7/month): No spin down, better performance
- **Standard Plan** ($25/month): Horizontal scaling, more resources
- **Database Upgrade**: More storage and connections

## Support

- Render Docs: https://render.com/docs
- Community Forum: https://community.render.com
- Email Support: support@render.com

---

**Repository:** https://github.com/beatpush329-afk/beatpush
**Deployment Date:** 2026
