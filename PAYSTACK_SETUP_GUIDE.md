# 💳 Paystack Setup Guide - Complete Payment Integration

## Why Paystack?

✅ **Perfect for Africa:** Native NGN (Naira) support
✅ **Global Coverage:** USD, EUR, GBP, ZAR, GHS, KES, and more
✅ **Subscriptions:** Built-in recurring payment support
✅ **Lower Fees:** Competitive rates for African markets
✅ **Local Payment Methods:** Bank transfer, USSD, Mobile Money
✅ **FREE Testing:** No credit card needed for test mode

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Paystack Account
1. Go to: https://dashboard.paystack.com/signup
2. Enter your email: beatpush329@gmail.com
3. Create password
4. Verify email (check inbox)
5. Complete business profile (can skip for testing)

### Step 2: Get Test API Keys
1. Login to: https://dashboard.paystack.com/
2. Go to: **Settings** → **API Keys & Webhooks**
3. Switch to **Test Mode** (toggle at top)
4. You'll see:
   - **Test Public Key** (starts with `pk_test_`)
   - **Test Secret Key** (starts with `sk_test_`)
5. Copy both keys

### Step 3: Add Keys to Backend
In your Render environment variables:

```bash
PAYSTACK_SECRET_KEY=sk_test_abc123xyz789...
PAYSTACK_PUBLIC_KEY=pk_test_abc123xyz789...
PAYMENT_PROVIDER=paystack
DEFAULT_CURRENCY=NGN
```

### Step 4: Add Keys to Frontend
In your Netlify environment variables:

```bash
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_abc123xyz789...
NEXT_PUBLIC_PAYMENT_PROVIDER=paystack
NEXT_PUBLIC_DEFAULT_CURRENCY=NGN
```

---

## 💰 Supported Currencies

Paystack supports multiple currencies for global reach:

### African Currencies
- **NGN** - Nigerian Naira (₦) - **PRIMARY**
- **ZAR** - South African Rand (R)
- **GHS** - Ghanaian Cedi (₵)
- **KES** - Kenyan Shilling (KSh)

### International Currencies
- **USD** - US Dollar ($)
- **GBP** - British Pound (£)
- **EUR** - Euro (€)

### Set Your Currency
```bash
# In backend .env
DEFAULT_CURRENCY=NGN  # Change to USD, GBP, EUR, ZAR, GHS, or KES
```

---

## 🔄 Subscriptions & Recurring Payments

Paystack has built-in subscription support - perfect for fan clubs and premium features!

### How It Works in BeatsPush:

1. **Create Subscription Plan** (via Paystack Dashboard):
   - Go to: **Payments** → **Plans**
   - Click **Create Plan**
   - Name: "Premium Fan Club"
   - Amount: ₦500 (or any amount)
   - Interval: Monthly, Yearly, etc.
   - Copy the **Plan Code**

2. **Use in BeatsPush:**
   - Plans are automatically synced
   - Users subscribe with one click
   - Automatic recurring billing
   - Cancellation supported

### Subscription Plans Example:
```
Basic Fan Club: ₦500/month
Premium Fan Club: ₦1,500/month
VIP Access: ₦5,000/month
```

---

## 🏦 Payment Methods Supported

### In Nigeria:
- ✅ **Debit/Credit Cards** (Visa, Mastercard, Verve)
- ✅ **Bank Account** (Direct bank transfer)
- ✅ **USSD** (Dial *code# to pay)
- ✅ **Bank Transfer** (Automated virtual accounts)
- ✅ **QR Code** (Scan and pay)
- ✅ **Mobile Money** (MTN, Airtel, etc.)

### International:
- ✅ **Credit Cards** (Visa, Mastercard, AmEx)
- ✅ **Apple Pay**
- ✅ **Google Pay**

---

## 🪝 Webhooks Setup (Important!)

Webhooks notify your backend when payments succeed, subscriptions renew, etc.

### Step 1: Get Webhook URL
After deploying backend, your webhook URL is:
```
https://beatpush-backend.onrender.com/api/v1/webhooks/paystack
```

### Step 2: Add Webhook in Paystack
1. Go to: https://dashboard.paystack.com/settings/webhooks
2. Click **Add Endpoint**
3. Enter URL: `https://beatpush-backend.onrender.com/api/v1/webhooks/paystack`
4. Select events:
   - ✅ `charge.success` (payment successful)
   - ✅ `subscription.create` (subscription created)
   - ✅ `subscription.disable` (subscription cancelled)
   - ✅ `subscription.expiring_cards` (card expiring soon)
5. Click **Add Endpoint**
6. Copy the **Webhook Secret**

### Step 3: Add Webhook Secret to Backend
```bash
PAYSTACK_WEBHOOK_SECRET=whsec_abc123xyz789...
```

---

## 🧪 Testing Payments

Paystack provides test cards for testing:

### Success Cards:
```
Card Number: 5061 0500 0000 0000 019
CVV: 123
Expiry: 12/26
PIN: 1234
OTP: 123456
```

### Decline Card:
```
Card Number: 5060 9900 0000 0000 021
CVV: 123
Expiry: 12/26
```

### Test in Your App:
1. Go to your deployed frontend
2. Try to purchase a beat or subscribe to a fan club
3. Use test card details above
4. Payment will succeed in test mode
5. Check Paystack dashboard to see the transaction

---

## 💸 Transaction Fees

### Test Mode:
- **FREE** - No charges in test mode
- Unlimited transactions
- Perfect for development

### Live Mode (Production):
| Region | Fee |
|--------|-----|
| Nigeria (Local Cards) | 1.5% (capped at ₦2,000) |
| Nigeria (International Cards) | 3.9% + ₦100 |
| International | 3.9% + $0.50 |

**Example:**
- ₦1,000 purchase = ₦15 fee (you get ₦985)
- ₦100,000 purchase = ₦1,500 fee (you get ₦98,500)

---

## 🔐 Security Features

Paystack includes:
- ✅ **3D Secure** (Extra card verification)
- ✅ **Fraud Detection** (AI-powered)
- ✅ **PCI DSS Compliant** (Industry standard)
- ✅ **SSL Encryption** (All transactions encrypted)
- ✅ **Refunds** (Easy refund processing)

---

## 📊 Go Live (Production Mode)

### Step 1: Complete KYC (Know Your Customer)
1. Go to: **Settings** → **Business Details**
2. Upload documents:
   - Business registration (if registered)
   - Valid ID (Driver's license, Passport, etc.)
   - Bank statement
3. Wait for approval (1-3 business days)

### Step 2: Add Bank Account
1. Go to: **Settings** → **Settlements**
2. Add your bank account details
3. Verify with micro-deposit (₦50 test transfer)

### Step 3: Switch to Live Keys
1. Go to: **Settings** → **API Keys**
2. Toggle to **Live Mode**
3. Get your **Live Keys**:
   - `pk_live_...`
   - `sk_live_...`

### Step 4: Update Environment Variables
Replace test keys with live keys:

**Backend:**
```bash
PAYSTACK_SECRET_KEY=sk_live_abc123xyz789...
PAYSTACK_PUBLIC_KEY=pk_live_abc123xyz789...
ENVIRONMENT=production
```

**Frontend:**
```bash
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_abc123xyz789...
```

### Step 5: Test with Real Card
Make a small test purchase (₦100) with your own card to verify

---

## 💼 Settlement (Getting Paid)

### When Do I Get Paid?
- **Nigeria (Local Cards):** Next business day (T+1)
- **International Cards:** 5-7 business days
- **Instant Settlements:** Available for verified businesses

### Settlement Schedule:
```
Monday transaction → Settles Tuesday
Friday transaction → Settles Monday
```

### Check Settlements:
1. Go to: **Transactions** → **Settlements**
2. View pending and completed settlements
3. Download settlement reports

---

## 🔍 Monitoring Transactions

### Dashboard Overview:
- View all transactions in real-time
- Filter by status (success, failed, pending)
- Export transaction history (CSV, Excel)
- Refund transactions
- View customer details

### Important Metrics:
- **Total Revenue:** Total amount processed
- **Success Rate:** % of successful transactions
- **Average Value:** Average transaction amount
- **Top Customers:** Biggest spenders

---

## 🆘 Common Issues & Solutions

### Issue: "Invalid API Key"
**Solution:** 
- Check you're using correct environment (test vs live)
- Verify key is copied correctly (no spaces)
- Ensure key starts with `pk_` or `sk_`

### Issue: "Payment Declined"
**Solution:**
- Check card has sufficient funds
- Verify card is enabled for online transactions
- Try different card
- Contact customer's bank

### Issue: "Webhook Not Receiving Events"
**Solution:**
- Verify webhook URL is correct
- Check backend is running
- Test webhook in Paystack dashboard
- Check backend logs for errors

### Issue: "Subscription Not Renewing"
**Solution:**
- Check customer's card is valid
- Verify subscription plan is active
- Check webhook events are being received
- Contact Paystack support

---

## 📞 Paystack Support

### Get Help:
- **Documentation:** https://paystack.com/docs
- **Email:** support@paystack.com
- **Twitter:** @PaystackHQ
- **Phone:** +234 1 888 5555 (Nigeria)
- **Live Chat:** Available in dashboard

### Community:
- **Slack:** https://slack.paystack.com
- **Forum:** https://forum.paystack.com

---

## 🎓 Advanced Features

### Split Payments
Route payments to multiple accounts (e.g., artist gets 70%, platform gets 30%)

### Dedicated Virtual Accounts
Give each customer a unique bank account number for transfers

### Payment Links
Create shareable payment links (no website needed)

### Invoicing
Send professional invoices to customers

### Recurring Charges
Charge cards without customer interaction (for subscriptions)

---

## ✅ Checklist

### Testing Phase:
- [ ] Paystack account created
- [ ] Email verified
- [ ] Test keys obtained
- [ ] Keys added to backend (Render)
- [ ] Keys added to frontend (Netlify)
- [ ] Webhook URL configured
- [ ] Test payment completed successfully
- [ ] Subscription test completed

### Production Phase:
- [ ] KYC documents submitted
- [ ] Business approved
- [ ] Bank account added and verified
- [ ] Live keys obtained
- [ ] Environment variables updated with live keys
- [ ] Live payment test completed
- [ ] First real settlement received

---

## 🎉 You're Ready!

With Paystack configured, BeatsPush can now:
- ✅ Accept payments in Naira and other currencies
- ✅ Handle one-time purchases (beats, tracks)
- ✅ Manage subscriptions (fan clubs, premium)
- ✅ Process tips and donations
- ✅ Support multiple payment methods
- ✅ Auto-settle to your bank account

**Start accepting payments now!** 💰

---

**Need help?** Check `DEPLOYMENT_QUICK_START.md` for full deployment guide.
