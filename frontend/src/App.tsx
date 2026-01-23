import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ManageBoards from './pages/ManageBoards';
import ManageStreams from './pages/ManageStreams';
import ManageSubjects from './pages/ManageSubjects';
import ManageNotes from './pages/ManageNotes';
import ManageOrders from './pages/ManageOrders';
import ManageContacts from './pages/ManageContacts';
import MyOrders from './pages/MyOrders';
import LegalIndex from './pages/Legal/LegalIndex';
import TermsAndConditions from './pages/Legal/TermsAndConditions';
import RefundPolicy from './pages/Legal/RefundPolicy';
import ShippingPolicy from './pages/Legal/ShippingPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/Legal" element={<LegalIndex/>} />
              <Route path="/terms" element={<TermsAndConditions/>} />
              <Route path="/refund" element={<RefundPolicy/>} />
              <Route path="/shipping" element={<ShippingPolicy/>} />
              <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>} />
              
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/boards"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageBoards />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/streams"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageStreams />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/subjects"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageSubjects />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/notes"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageNotes />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageOrders />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/contacts"
                element={
                  <ProtectedRoute adminOnly>
                    <ManageContacts />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
