# Frontend Guide - Notes Selling Platform

## 🎨 Modern React Frontend with TypeScript

This is a complete, modern frontend for the notes selling platform with full API integration.

## 📁 Project Structure

```
frontend/src/
├── api/                    # API integration layer
│   ├── axios.ts           # Axios instance with interceptors
│   ├── auth.ts            # Authentication API
│   ├── boards.ts          # Boards API
│   ├── streams.ts         # Streams API
│   ├── notes.ts           # Notes API
│   └── orders.ts          # Orders API
├── components/            # Reusable components
│   ├── Navbar.tsx         # Navigation bar
│   ├── Hero.tsx           # Hero section
│   ├── Boards.tsx         # Boards display
│   └── ProtectedRoute.tsx # Route protection
├── context/               # React Context
│   └── AuthContext.tsx    # Authentication context
├── pages/                 # Page components
│   ├── Home.tsx           # Home page
│   ├── Shop.tsx           # Shop page with filters
│   ├── Contact.tsx        # Contact page
│   ├── Login.tsx          # Login page
│   ├── Register.tsx       # Registration page
│   ├── MyOrders.tsx       # User orders page
│   ├── AdminDashboard.tsx # Admin dashboard
│   ├── ManageBoards.tsx   # Manage boards (Admin)
│   ├── ManageStreams.tsx  # Manage streams (Admin)
│   ├── ManageNotes.tsx    # Manage notes (Admin)
│   └── ManageOrders.tsx   # Manage orders (Admin)
├── App.tsx                # Main app with routing
└── main.tsx               # Entry point
```

## 🚀 Features

### Public Pages
- **Home Page**: Hero section, boards display, features showcase
- **Shop Page**: Browse notes with board/stream filters, shopping cart
- **Contact Page**: Contact form with company information

### Authentication
- **Login**: User authentication with JWT
- **Register**: New user registration
- **Protected Routes**: Automatic redirect for unauthorized access

### User Features
- **My Orders**: View purchase history
- **Shopping Cart**: Add/remove notes before checkout
- **Filtered Search**: Filter notes by board and stream

### Admin Features
- **Admin Dashboard**: Central hub for management
- **Manage Boards**: CRUD operations for educational boards
- **Manage Streams**: CRUD operations for streams (linked to boards)
- **Manage Notes**: Upload and manage PDF notes with metadata
- **Manage Orders**: View all orders and payment status

## 🎨 Design Features

- **Modern Gradient UI**: Purple gradient theme (#667eea to #764ba2)
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: Hover effects and transitions
- **Clean Typography**: Professional font hierarchy
- **Card-based Layout**: Modern card design for content
- **Modal Forms**: Clean modal dialogs for CRUD operations

## 🔧 Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:5000/api`

### Authentication Flow
1. User logs in/registers
2. JWT token stored in localStorage
3. Token automatically added to all API requests
4. Auto-redirect to login on 401 errors

### API Endpoints Used
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/boards` - Get all boards
- `GET /api/streams/board/:boardId` - Get streams by board
- `GET /api/notes` - Get all notes (with filters)
- `POST /api/orders/create` - Create new order
- `GET /api/orders/my-orders` - Get user orders
- Admin endpoints for CRUD operations

## 👤 User Roles

### Regular User
- Browse and purchase notes
- View order history
- Access to: Home, Shop, Contact, My Orders

### Admin User
- All user features
- Manage boards, streams, notes
- View all orders
- Access to: Admin Dashboard and all management pages

## 🎯 Key Components

### AuthContext
Manages authentication state globally:
- User information
- Login/logout functions
- Admin role checking
- Token management

### ProtectedRoute
Wraps routes requiring authentication:
- Redirects to login if not authenticated
- Supports admin-only routes
- Shows loading state during auth check

### Shop Page
Advanced shopping experience:
- Filter by board and stream
- Add to cart functionality
- Real-time price calculation
- Checkout integration

## 🎨 Styling

All components use CSS modules with:
- Consistent color scheme
- Responsive breakpoints
- Smooth transitions
- Modern shadows and borders
- Professional spacing

## 🔐 Security Features

- JWT token authentication
- Automatic token refresh
- Protected routes
- Admin role verification
- XSS protection via React
- CORS handling

## 📱 Responsive Design

Breakpoints:
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🚀 Performance

- Code splitting with React Router
- Lazy loading for routes
- Optimized re-renders with React hooks
- Efficient state management

## 🎓 Usage

### For Students
1. Register/Login
2. Browse notes by board and stream
3. Add notes to cart
4. Checkout and pay
5. Download purchased notes

### For Admins
1. Login with admin account
2. Access admin dashboard
3. Manage boards, streams, and notes
4. Upload PDF files for notes
5. Monitor orders and payments

## 🛠️ Technologies Used

- **React 18**: Latest React features
- **TypeScript**: Type safety
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **Context API**: State management
- **CSS3**: Modern styling

## 📝 Notes

- Backend must be running on port 5000
- MongoDB must be connected for full functionality
- Admin user must be created manually in database
- File uploads limited to PDF format
- Payment integration uses Razorpay (requires configuration)

## 🎉 Ready to Use!

The frontend is fully functional and ready to connect to your backend. Just ensure:
1. Backend is running
2. MongoDB is connected
3. CORS is enabled on backend
4. Environment variables are set

Happy coding! 🚀
