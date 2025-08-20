# 🚀 Development Environment Setup

## 📋 **For Local Development Testing**

### **1. Create Local Environment File**
```bash
# Copy the development template
cp env.development.template .env.local

# Edit with your actual values
nano .env.local
```

### **2. Required Environment Variables for Development**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://slgpzdwzxnwcotragubz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_key

# EazyNet Backend Configuration (Development)
NEXT_PUBLIC_EAZYNET_API_URL=https://localhost:7061

# Site Configuration (Development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### **3. Start Development Server**
```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

### **4. Test Local Backend**
- **Frontend:** http://localhost:3000
- **Backend:** https://localhost:7061
- **OAuth:** Will redirect to localhost:3000

## 🔄 **Switching Between Environments**

### **Development (Local)**
- Use `.env.local` file
- Backend: `https://localhost:7061`
- Site: `http://localhost:3000`

### **Production (Vercel)**
- Use Vercel environment variables
- Backend: `https://eazynet-api.onrender.com`
- Site: `https://eazynet.app`

## 🧪 **Testing Scenarios**

### **Local Development**
- ✅ **Frontend + Local Backend**
- ✅ **OAuth redirects to localhost**
- ✅ **API calls to localhost:7061**

### **Production Testing**
- ✅ **Frontend + Render Backend**
- ✅ **OAuth redirects to eazynet.app**
- ✅ **API calls to onrender.com**

## ⚠️ **Important Notes**

1. **Don't commit `.env.local`** (it's in .gitignore)
2. **Use different OAuth redirect URLs** for dev vs production
3. **Backend must be running** on localhost:7061 for local testing
4. **Clear browser cache** when switching environments

## 🔍 **Troubleshooting**

### **If Local Backend Not Working:**
- Check if backend is running on port 7061
- Verify HTTPS certificate for localhost
- Check browser console for connection errors

### **If OAuth Not Working:**
- Verify redirect URLs in Supabase/Google Console
- Check environment variables are loaded
- Clear browser cookies/cache

---

**Happy Local Development! 🎉**
