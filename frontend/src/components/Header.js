import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useState, useEffect } from 'react';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm text-gray-800 shadow-lg' : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isScrolled ? 'bg-primary-100' : 'bg-white/20'} mr-3`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${isScrolled ? 'text-primary-600' : 'text-white'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.16 4.16l1.42 1.42A6.99 6.99 0 0010 18a7 7 0 005.84-10.84l1.42-1.42a9 9 0 11-13.1 0z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 018 8c0 .97-.175 1.9-.493 2.76l-1.59-1.59A6 6 0 0010 4a5.98 5.98 0 00-4.242 1.757l-1.59-1.59A8 8 0 0110 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-bold tracking-tight">Carbon Tracker</span>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-full focus:outline-none focus:ring-2 ${isScrolled ? 'bg-gray-100 focus:ring-primary-500 text-gray-600 hover:bg-gray-200' : 'bg-white/10 focus:ring-white text-white hover:bg-white/20'} transition-all duration-200`}
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          <nav className="hidden md:block">
            <ul className="flex space-x-1 items-center">
              {user ? (
                <>
                  <li>
                    <Link
                      to="/app"
                      className={`px-3 py-2 rounded-full font-medium hover:bg-opacity-80 transition-all duration-200 ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} flex items-center`}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/app/add-footprint"
                      className={`px-3 py-2 rounded-full font-medium hover:bg-opacity-80 transition-all duration-200 ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} flex items-center`}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Entry
                    </Link>
                  </li>


                  <li>
                    <Link
                      to="/app/profile"
                      className={`px-3 py-2 rounded-full font-medium hover:bg-opacity-80 transition-all duration-200 ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} flex items-center`}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                  </li>
                  <li className="ml-2">
                    <button
                      className={`${isScrolled ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-white text-primary-600 hover:bg-gray-100'} px-4 py-2 rounded-full font-medium transition-all duration-200 shadow-sm flex items-center`}
                      onClick={onLogout}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className={`px-3 py-2 rounded-full font-medium hover:bg-opacity-80 transition-all duration-200 ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} flex items-center`}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className={`${isScrolled ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-white text-primary-600 hover:bg-gray-100'} px-4 py-2 rounded-full font-medium transition-all duration-200 shadow-sm flex items-center ml-2`}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Register
                    </Link>
                  </li>
                </>
              )}
          </ul>
        </nav>
      </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg overflow-hidden transition-all duration-300">
            <nav className="px-4 py-3">
              <ul className="space-y-3">
                {user ? (
                  <>
                    <li>
                      <Link
                        to="/app"
                        className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/app/add-footprint"
                        className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Add Entry
                      </Link>
                    </li>


                    <li>
                      <Link
                        to="/app/profile"
                        className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li className="pt-2 border-t border-gray-200">
                      <button
                        className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
                        onClick={onLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </li>
                    <li className="pt-2">
                      <Link
                        to="/register"
                        className="block w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;