import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Rooms from './pages/Rooms';
import Reservations from './pages/Reservations';
import Feedbacks from './pages/Feedbacks';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';

function AppRoutes() {
    const { isAuthenticated } = useAuth();
    
    return (
        <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
            <Route
                path="/"
                element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
            >
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="rooms" element={<Rooms />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="feedbacks" element={<Feedbacks />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster position="top-right" />
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;