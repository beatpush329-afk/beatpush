# BeatsPush - Render Deployment Guide

## Quick Setup (Both Backend + Frontend)

### Option 1: Auto-Deploy with render.yaml (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New" → "Blueprint"**
3. **Connect your GitHub repo**: `beatpush329-afk/beatpush`
4. **Render will detect `render.yaml`** and create both services automatically
5. **Add environment variables** in the backend service:
   - `SECRET_KEY` = `beatspush_production_min_32_chars_secret_key_change_this_12345`
   - `SMTP_USER` = `beatpush329@gmail.com`
   - `SMTP_PASSWORD` = `YOUR_GMAIL_APP_PASSWORD`

### Option 2: Manual Setup (Step by Step)

#### A. Deploy Backend (Already Done ✅)
- Your backend is live at: https://beatpush-c1gs.onrender.com

#### B. Deploy Frontend (New)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New" → "Static Site"**
3. **Connect GitHub**: Select `beatpush329-afk/beatpush`
4. **Configure:**
   ```
   Name: beatpush-frontend
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: out
   Auto-Deploy: Yes
   ```

5. **Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   NEXT_PUBLIC_API_URL = https://beatpush-c1gs.onrender.com
   NODE_VERSION = 20.11.0
   ```

6. **Click "Create Static Site"**

7. **Wait for build** (3-5 minutes)

8. **Your frontend URL**: Will be `https://beatpush-frontend.onrender.com` (or custom name you chose)

---

## Update Backend FRONTEND_URL

After frontend deploys, update backend env var:

1. Go to backend service on Render
2. Environment → Edit `FRONTEND_URL`
3. Change to: `https://beatpush-frontend.onrender.com` (or your actual frontend URL)
4. Save (will trigger redeploy)

---

## Custom Domain Setup

### For Frontend:
1. Go to frontend service → Settings → Custom Domain
2. Add: `www.beatpush.com` (or your domain)
3. Add DNS records at your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: beatpush-frontend.onrender.com
   ```

### For Backend:
1. Go to backend service → Settings → Custom Domain
2. Add: `api.beatpush.com`
3. Add DNS records:
   ```
   Type: CNAME
   Name: api
   Value: beatpush-c1gs.onrender.com
   ```

---

## Troubleshooting

### Build Fails with "onClick handler" error?
The `output: 'export'` in `next.config.js` should fix this by doing static export.

### Frontend shows blank page?
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_API_URL` environment variable is set correctly
3. Check if API is accessible: Visit `https://beatpush-c1gs.onrender.com/health`

### "Cannot find module" errors?
Run locally first to verify:
```bash
cd frontend
npm install
npm run build
```

### Static export fails on dynamic routes?
Some pages with dynamic data fetching may need to be converted to client-side data fetching.

---

## Testing Deployment

Once both services are live:

1. **Visit frontend URL**: `https://beatpush-frontend.onrender.com`
2. **Try registration**: Create a test account
3. **Check backend logs**: Render Dashboard → Backend Service → Logs
4. **Test API**: `https://beatpush-c1gs.onrender.com/docs`

---

## Free Tier Limits

### Static Site (Frontend):
- ✅ **Free forever**
- ✅ 100GB bandwidth/month
- ✅ Auto SSL
- ✅ Global CDN
- ⚠️ Sleeps after 15 min inactivity (wakes in ~30s)

### Web Service (Backend):
- ✅ 750 hours/month (enough for 24/7 on one service)
- ✅ Auto SSL
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Limited to 512MB RAM

### Tips to stay within limits:
- Keep only production services on free tier
- Use paid tier ($7/month) when you have users to avoid sleep
- Monitor bandwidth in dashboard

---

## Current Status

✅ **Backend**: Live at https://beatpush-c1gs.onrender.com
⏳ **Frontend**: Ready to deploy (follow steps above)

---

## Next Steps After Deployment

1. ✅ Test all features (login, upload, browse)
2. ✅ Add payment integration (Paystack keys)
3. ✅ Set up custom domain
4. ✅ Configure email (Gmail SMTP or SendGrid)
5. ✅ Monitor logs for errors
6. ✅ Plan for missing features (see COMPLETE_ARCHITECTURE_ROADMAP.txt)

---

## Support

- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com
- **Community**: https://community.render.com
