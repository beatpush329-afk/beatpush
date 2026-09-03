# 🔑 How to Get FREE API Keys for Testing

This guide shows you how to get all the free API keys you need to test BeatsPush.

## ✅ Gmail SMTP (You Already Have This!)

### Setup Gmail App Password
1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not enabled)
3. Go to: https://myaccount.google.com/apppasswords
4. Select app: **Mail**
5. Select device: **Other** (type "BeatsPush")
6. Click **Generate**
7. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Use in Backend:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=beatpush329@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
```

---

## 💳 Paystack (Payment Processing) - FREE TEST MODE ⭐ PRIMARY

**Perfect for Nigeria & Africa!** Supports NGN (Naira), USD, EUR, GBP, and more.

### Sign Up
1. Go to: https://dashboard.paystack.com/signup
2. Sign up with email: beatpush329@gmail.com
3. Verify email

### Get Test Keys
1. Go to: https://dashboard.paystack.com/#/settings/developer
2. Switch to **Test Mode** (toggle at top)
3. Copy **Public Key** (starts with `pk_test_`)
4. Copy **Secret Key** (starts with `sk_test_`)

### Use in Backend:
```bash
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
PAYMENT_PROVIDER=paystack
DEFAULT_CURRENCY=NGN
```

### Use in Frontend:
```bash
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_PAYMENT_PROVIDER=paystack
NEXT_PUBLIC_DEFAULT_CURRENCY=NGN
```

### Features:
- ✅ **Naira Payments** (NGN)
- ✅ **Bank Transfer** (Automated)
- ✅ **USSD** (*737# payments)
- ✅ **Mobile Money**
- ✅ **Subscriptions** (Built-in)
- ✅ **International Cards**

**Note:** Test mode is 100% FREE. No real money involved!

---

## 💰 Stripe (Alternative - For US/Europe ONLY)

**Use Paystack instead!** Stripe doesn't support Nigerian Naira well.

If you still want Stripe for international markets:

### Sign Up
1. Go to: https://dashboard.stripe.com/register
2. Sign up with email: beatpush329@gmail.com
3. Skip business details (for now)

### Get Test Keys
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** (starts with `pk_test_`)
3. Click **Reveal test key** and copy **Secret key** (starts with `sk_test_`)

### Use in Backend:
```bash
STRIPE_SECRET_KEY=sk_test_51AB...xyz
STRIPE_PUBLISHABLE_KEY=pk_test_51AB...xyz
```

### Use in Frontend:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AB...xyz
```

**Note:** Test mode is 100% FREE. No real money involved!

---

## 💰 Paystack (Alternative Payment) - FREE TEST MODE

### Sign Up (For Nigerian/African Markets)
1. Go to: https://dashboard.paystack.com/signup
2. Sign up with email: beatpush329@gmail.com
3. Verify email

### Get Test Keys
1. Go to: https://dashboard.paystack.com/#/settings/developers
2. Copy **Public Key** (starts with `pk_test_`)
3. Copy **Secret Key** (starts with `sk_test_`)

### Use in Backend:
```bash
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
```

---

## ☁️ Cloudflare R2 (File Storage) - 10GB FREE

### Sign Up
1. Go to: https://dash.cloudflare.com/sign-up
2. Sign up with email: beatpush329@gmail.com
3. Verify email

### Create R2 Bucket
1. Go to: https://dash.cloudflare.com/ → **R2**
2. Click **Create bucket**
3. Name: `beatpush-uploads`
4. Click **Create bucket**

### Get API Keys
1. Go to **R2** → **Manage R2 API Tokens**
2. Click **Create API token**
3. Token name: `beatpush-backend`
4. Permissions: **Object Read & Write**
5. Apply to: **Specific buckets** → Select `beatpush-uploads`
6. Click **Create API token**
7. Copy:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL

### Use in Backend:
```bash
AWS_ACCESS_KEY_ID=<your_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_secret_access_key>
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_BUCKET_NAME=beatpush-uploads
```

**Free Tier:** 10GB storage, 1M Class A operations/month

---

## 🤖 OpenAI (AI Features) - $5 FREE CREDIT

### Sign Up
1. Go to: https://platform.openai.com/signup
2. Sign up with email: beatpush329@gmail.com
3. Verify phone number

### Get API Key
1. Go to: https://platform.openai.com/api-keys
2. Click **Create new secret key**
3. Name: `beatpush-backend`
4. Copy the key (starts with `sk-proj-...`)

### Use in Backend:
```bash
OPENAI_API_KEY=sk-proj-...
AI_ENABLED=true
```

**Free:** $5 credit (enough for ~1,000 requests)

### Alternative: HuggingFace (100% FREE)
1. Go to: https://huggingface.co/join
2. Sign up
3. Go to: https://huggingface.co/settings/tokens
4. Create new token
5. Use in backend:
```bash
HUGGINGFACE_API_KEY=hf_...
USE_HUGGINGFACE=true
```

---

## 🤖 Cloudflare Turnstile (CAPTCHA) - FREE FOREVER

### Sign Up
1. Go to: https://dash.cloudflare.com/ (use same account from R2)
2. Go to **Turnstile** section
3. Click **Add site**

### Configure
- **Site name:** BeatsPush
- **Domain:** `localhost` (for testing)
- **Mode:** Managed (recommended)

### Get Keys
Copy:
- **Site key** (public)
- **Secret key** (private)

### Use in Backend:
```bash
TURNSTILE_SECRET_KEY=0x...
```

### Use in Frontend:
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x...
```

**Free Tier:** Unlimited requests!

---

## 📊 Google Analytics (Optional) - FREE

### Sign Up
1. Go to: https://analytics.google.com/
2. Sign in with beatpush329@gmail.com
3. Click **Start measuring**
4. Account name: `BeatsPush`
5. Property name: `BeatsPush Platform`
6. Click through setup

### Get Measurement ID
1. Go to **Admin** → **Data Streams**
2. Click your web stream
3. Copy **Measurement ID** (format: `G-XXXXXXXXXX`)

### Use in Frontend:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 📱 Twilio (SMS) - FREE TRIAL ($15 CREDIT)

### Sign Up
1. Go to: https://www.twilio.com/try-twilio
2. Sign up with email: beatpush329@gmail.com
3. Verify phone number

### Get Credentials
1. Go to: https://console.twilio.com/
2. Find your **Account SID** and **Auth Token**
3. Get a phone number: **Phone Numbers** → **Buy a number**

### Use in Backend:
```bash
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
SMS_ENABLED=true
```

**Free Trial:** $15 credit (about 500 SMS)

---

## 🔐 Google OAuth (Social Login) - FREE

### Create Project
1. Go to: https://console.cloud.google.com/
2. Sign in with beatpush329@gmail.com
3. Create new project: `BeatsPush`
4. Go to **APIs & Services** → **OAuth consent screen**
5. User Type: **External**
6. App name: `BeatsPush`
7. User support email: beatpush329@gmail.com
8. Developer contact: beatpush329@gmail.com
9. Save and continue

### Create OAuth Client
1. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
2. Application type: **Web application**
3. Name: `BeatsPush Web`
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-app.netlify.app/api/auth/callback/google`
5. Click **Create**
6. Copy **Client ID** and **Client Secret**

### Use in Frontend:
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...apps.googleusercontent.com
```

### Use in Backend:
```bash
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

---

## 📝 Summary: What You Need NOW

### Must Have (Start Testing):
✅ **Gmail SMTP** - You already have this!
```bash
SMTP_USER=beatpush329@gmail.com
SMTP_PASSWORD=<16-char-app-password>
```

### Should Have (Core Features):
⭐ **Paystack Test Keys** - 5 minutes to get (PRIMARY)
⭐ **Cloudflare R2** - 10 minutes to set up

### Nice to Have (Add Later):
💡 OpenAI or HuggingFace - AI features
💡 Turnstile - Bot protection
💡 Google Analytics - Tracking

---

## 🎯 Quick Start Order

1. **Gmail App Password** (2 min) ✅ DO THIS FIRST
2. **Paystack Test Keys** (5 min) ⭐ ESSENTIAL (Supports Naira!)
3. **Cloudflare R2** (10 min) ⭐ IMPORTANT
4. **Deploy Backend** to Render
5. **Deploy Frontend** to Netlify
6. **Add other keys later** as needed

---

## 💡 Pro Tips

### For Testing Without External APIs:
You can test locally with minimal setup:
```bash
# Backend
USE_LOCAL_STORAGE=true
REDIS_ENABLED=false
AI_ENABLED=false
SMS_ENABLED=false

# This works with just Gmail SMTP + Paystack test keys!
```

### Security Notes:
- ⚠️ Never commit API keys to GitHub
- ⚠️ Use `.env` files (already in `.gitignore`)
- ⚠️ Rotate keys periodically
- ⚠️ Use test keys for development

---

## 🆘 Need Help?

**Can't get a specific key?**
- Skip it for now and enable that feature later
- Most features work without all keys

**Exceeded free limits?**
- Create new account with different email
- Upgrade to paid plan (very cheap)

---

**Repository:** https://github.com/beatpush329-afk/beatpush
**Ready to deploy!** 🚀
