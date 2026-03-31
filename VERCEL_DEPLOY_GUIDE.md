# Deploy Frontend to Vercel ✅

## Easiest Way: One-Click Deploy 🚀

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select your GitHub repo `bank-account-mangement`
5. Click "Import"
6. **Root Directory**: `frontend` (very important!)
7. Click "Deploy"
8. Wait 2-3 minutes for deployment ✅

### Step 3: Set Environment Variables (IMPORTANT!) 🔐

After deployment completes:
1. Go to Project Settings → Environment Variables
2. Add:
   - **Name**: `VITE_BACKEND_URL`
   - **Value**: Your Render backend URL (e.g., `https://bank-backend-xyz.onrender.com/api`)

3. Click "Save"
4. Click "Redeploy" to rebuild with the new variables

### Step 4: Verify Deployment ✅

Your frontend will be live at: `https://your-project-name.vercel.app`

Try logging in - it should connect to your backend!

---

## Alternative: Manual Deploy (If Needed)

### Build Locally:
```bash
cd frontend
npm install
npm run build
```

### Deploy Build Files:
1. Go to vercel.com
2. Click "New Project"
3. Select "Import from Git"
4. Choose your repo
5. Set Root Directory to `frontend`
6. Click "Deploy"

---

## Configure Backend URL 🌐

### For Local Development:
```bash
cd frontend
echo "VITE_BACKEND_URL=http://localhost:8080/api" > .env.local
npm run dev
```

### For Production (On Vercel):
Set in Vercel Dashboard:
```
VITE_BACKEND_URL=https://bank-backend-xyz.onrender.com/api
```

---

## API Endpoints Used 📱

Frontend will call these endpoints:
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/deposit` - Deposit money
- `POST /api/withdraw` - Withdraw money
- `POST /api/transfer` - Transfer money
- `PUT /api/users/{id}/password` - Change password
- `GET /api/weather?city=Hyderabad` - Get weather
- `GET /api/summary/{phone}` - Transaction summary

---

## Troubleshooting 🔧

### "Cannot fetch from backend"
- Check VITE_BACKEND_URL is set correctly in Vercel
- Verify backend is running and accessible
- Check browser console for exact error
- Ensure backend has CORS enabled

### "Build failed"
- Check Node.js version: `node --version` (needs v16+)
- Verify all dependencies: `npm install`
- Check for syntax errors: `npm run lint`

### "Frontend works but API fails"
- Backend not running? Deploy to Render first
- Wrong API URL? Update VITE_BACKEND_URL in Vercel settings
- CORS blocked? Backend needs CORS headers

### "Page shows 404"
- Check Vercel deployment logs
- Click "Visit" button in Vercel dashboard
- Verify frontend built successfully

---

## What Gets Deployed ✅

Vercel automatically:
- ✅ Builds your React app: `npm run build`
- ✅ Optimizes production build
- ✅ Hosts on Vercel CDN (fast globally!)
- ✅ Provides SSL/HTTPS automatic
- ✅ Auto-redirects HTTP → HTTPS

---

## Next Steps 🚀

1. ✅ Deploy frontend to Vercel (this guide)
2. **Already done**: Deploy backend to Render (see RENDER_SIMPLE_GUIDE.md)
3. Connect frontend to backend via environment variable
4. Test all features work together
5. Share your app with friends!

---

## Quick Checklist ✅

- [ ] Code pushed to GitHub
- [ ] vercel.json created
- [ ] api.js uses VITE_BACKEND_URL
- [ ] Vercel project created
- [ ] Root directory set to `frontend`
- [ ] Environment variables set
- [ ] Backend running on Render
- [ ] Frontend deployment completed
- [ ] Testing successful
