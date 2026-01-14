# Backend Quick Start

## Start Development Server

```bash
npm run dev
```

## If Port 5000 is Busy

```bash
# Windows - Kill port and start
npm run dev:clean

# Or manually change port in .env
PORT=5001
```

## Current Status

✅ TypeScript configured  
✅ Express server ready  
✅ Razorpay configured (temporary keys)  
⚠️ MongoDB not connected (optional for now)

## What Works Without MongoDB

- Server starts successfully
- API endpoints are accessible
- Razorpay integration ready

## What Needs MongoDB

- User authentication
- Notes CRUD operations
- Order management
- All database features

## Install MongoDB Later

See main SETUP.md for MongoDB installation instructions.
