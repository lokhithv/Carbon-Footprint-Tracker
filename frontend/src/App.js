import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import FootprintForm from './pages/FootprintForm';
import Recommendations from './pages/Recommendations';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './components/PrivateRoute';
import { validateToken } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      dispatch(validateToken());
    }
  }, [dispatch]);

  return (
    <>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-300">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/app" element={
                <>
                  <Header />
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24 md:pt-28">
                    <Outlet />
                  </div>
                </>
              }>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="add-footprint" element={<FootprintForm />} />
                <Route path="edit-footprint/:id" element={<FootprintForm />} />
                <Route path="recommendations" element={<Recommendations />} />
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </>
  );
}

export default App;