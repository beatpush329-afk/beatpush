# ✅ Quick Render Deployment Checklist

## Before You Start
- [ ] GitHub repository pushed: https://github.com/beatpush329-afk/beatpush
- [ ] Render account created (use beatpush329@gmail.com)
- [ ] Have payment provider keys ready (Stripe/Paystack)
- [ ] Have cloud storage keys ready (Cloudflare R2/AWS S3)

## Deployment Steps

### 1. Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub (beatpush329-afk account)
- [ ] Authorize Render to access your repositories

### 2. Deploy Using Blueprint (EASIEST METHOD)
- [ ] Click **"New +"** → **"Blueprint"**
- [ ] Select repository: `beatpush329-afk/beatpush`
- [ ] Render auto-detects `render.yaml`
- [ ] Click **"Apply"**
- [ ] Wait 5-10 minutes for deployment

### 3. Generate SECRET_KEY
Run this in your terminal or Python:
```python
import secrets
print(secrets.token_urlsafe(32))
```
Copy the output and save it.

### 4. Add Environment Variables
Go to Service → Environment tab and add these REQUIRED variables:

```
SECRET_KEY=<paste_generated_secret_key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
DEBUG=False
```

**Payment (Choose one):**
```
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# OR Paystack
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
```

**Storage (R2/S3):**
```
AWS_ACCESS_KEY_ID=<your_key>
AWS_SECRET_ACCESS_KEY=<your_secret>
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_BUCKET_NAME=beatpush-uploads
```

### 5. Run Database Migrations
- [ ] Go to web service → **Shell** tab
- [ ] Run: `cd backend && alembic upgrade head`
- [ ] Verify: `python check_db.py`

### 6. Test Your API
- [ ] Open: `https://your-service-name.onrender.com/docs`
- [ ] Test health endpoint
- [ ] Try creating a test user

### 7. Get Your Backend URL
- [ ] Copy your backend URL (e.g., `https://beatpush-backend.onrender.com`)
- [ ] Save it for frontend configuration

## ⚠️ Important Notes

### Free Tier
- ✅ FREE forever
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold start takes 30-60 seconds on first request
- ✅ 750 hours/month included

### Database
- ✅ PostgreSQL included free
- ✅ 256MB storage
- ✅ 7-day backup retention

### Redis
- ✅ Redis included free
- ✅ 25MB storage

## 🔥 Quick Commands

### View Logs
```bash
# In Render Dashboard → Logs tab
# Or use Render CLI
render logs -s beatpush-backend
```

### Restart Service
Dashboard → Manual Deploy → Deploy latest commit

### Update Code
```bash
git add .
git commit -m "Update"
git push origin main
# Auto-deploys in 2-5 minutes
```

## 🆘 Troubleshooting

**Service won't start?**
- Check logs for errors
- Verify `DATABASE_URL` is set
- Ensure `main.py` exists in backend folder

**Database connection fails?**
- Use **Internal Database URL** (not External)
- Format: `postgresql://user:pass@host/db`

**Application crashes?**
- Check environment variables are set
- Verify Python version (3.11.0)
- Check requirements.txt dependencies

## 📱 Next Steps

After backend is deployed:
1. Deploy frontend to Vercel
2. Update CORS settings with frontend URL
3. Configure webhooks for Stripe/Paystack
4. Set up custom domain (optional)
5. Enable monitoring and alerts

## 🔗 Useful Links

- **Your Repository:** https://github.com/beatpush329-afk/beatpush
- **Render Dashboard:** https://dashboard.render.com
- **Render Docs:** https://render.com/docs
- **Full Guide:** See `RENDER_DEPLOYMENT_GUIDE.md`

---
**Deployment Ready!** Follow this checklist and you'll be live in 15 minutes! 🚀
