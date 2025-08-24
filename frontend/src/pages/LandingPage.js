import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/landing-page.css';

import logoImage from '../assets/hero-earth.svg';
import heroImage from '../assets/hero-bg.jpg';
import feature1Image from '../assets/car-icon.svg';
import feature2Image from '../assets/dashboard-icon.svg';
import feature3Image from '../assets/tips-icon.svg';
import dashboardPreviewImage from '../assets/dashboard-preview.svg';
import testimonialImage from '../assets/testimonial-vehicle.svg';
import contactImage from '../assets/contact-aerial.svg';
import ChatbotInterface from '../components/ChatbotInterface';

function LandingPage() {
  const { user } = useSelector((state) => state.auth);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Environmental Activist",
      text: "CarbonTracker has completely changed how I approach my daily habits. Seeing my carbon footprint in real-time motivated me to make sustainable changes I never thought possible.",
      image: testimonialImage
    },
    {
      name: "Marcus Rodriguez",
      role: "Sustainability Manager",
      text: "The insights and recommendations are spot-on. Our team reduced our office's carbon emissions by 30% in just three months using CarbonTracker's business features.",
      image: testimonialImage
    },
    {
      name: "Emma Thompson",
      role: "Climate Conscious Parent",
      text: "Teaching my kids about environmental responsibility became so much easier with CarbonTracker. They love tracking our family goals and celebrating our green achievements!",
      image: testimonialImage
    }
  ];

  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
          element.classList.add('animate-fade-in');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', animateOnScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(interval);
    };
  }, [testimonials.length, showUserMenu]);

  return (
    <div className="landing-page">
      <div className="bg-green-500 text-white py-3 px-4 text-center">
        <p>Join thousands tracking their carbon footprint and making a difference for our planet!</p>
      </div>
      
      <nav className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex items-center">
          <Link to="/" className="flex items-center mr-8">
            <img src={logoImage} alt="CarbonTracker" className="h-12" />
          </Link>
          
          <div className="flex items-center space-x-6 flex-1">
          </div>
          
          <div className="flex items-center">
            {!user ? (
              <Link 
                to="/login"
                className="bg-green-500 text-white px-4 py-2 rounded-full font-medium hover:bg-green-600 transition-colors"
              >
                GET STARTED
              </Link>
            ) : (
              <div className="relative user-menu-container">
                 <button 
                   onClick={() => setShowUserMenu(!showUserMenu)}
                   className="bg-green-500 text-white px-4 py-2 rounded-full font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
                 >
                   <span>{user.name || user.email?.split('@')[0] || 'User'}</span>
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                 </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                          {(user.name || user.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name || 'User'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link 
                        to="/app/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Profile
                      </Link>
                      <Link 
                        to="/app" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Dashboard
                      </Link>
                      <button 
                         onClick={() => {
                           localStorage.removeItem('user');
                           localStorage.removeItem('token');
                           window.location.href = '/';
                         }}
                         className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                       >
                         Logout
                       </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <section className="hero-section relative h-screen" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/50 to-blue-900/70"></div>
        <div className="container mx-auto h-full flex items-center relative z-10 px-6">
          <div className="text-white max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Track Your<br />Carbon Footprint<br />Make a Difference
            </h1>
            <p className="text-xl mb-8 max-w-2xl">
              Monitor your environmental impact with our intuitive carbon tracking platform. Start your journey to a greener lifestyle today.
            </p>
            {!user ? (
              <Link
                to="/login"
                className="mt-8 bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-full font-medium transition-colors"
              >
                START TRACKING
              </Link>
            ) : (
              <Link
                to="/app/add-footprint"
                className="mt-8 bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-full font-medium transition-colors"
              >
                START TRACKING
              </Link>
            )}
          </div>
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 writing-mode-vertical">
          <span className="transform rotate-180 inline-block whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>CarbonTracker</span>
        </div>
      </section>

      <section className="py-20 bg-green-50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Go Green
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform makes carbon tracking simple, actionable, and rewarding.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg animate-on-scroll">
              <img src={feature1Image} alt="Transportation" className="w-16 h-16 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Transportation</h3>
              <p className="text-gray-600">
                Track emissions from cars, flights, public transport, and more. Get personalized recommendations for greener travel options.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg animate-on-scroll">
              <img src={feature2Image} alt="Energy Usage" className="w-16 h-16 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Energy Usage</h3>
              <p className="text-gray-600">
                Monitor your home and office energy consumption. Identify opportunities to reduce usage and switch to renewable sources.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg animate-on-scroll">
              <img src={feature3Image} alt="Lifestyle Insights" className="w-16 h-16 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lifestyle Insights</h3>
              <p className="text-gray-600">
                Get detailed analytics on your consumption patterns and receive actionable tips to reduce your environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your Personal Climate Dashboard
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Visualize your carbon footprint across multiple categories with intuitive charts and real-time tracking. Set goals, monitor progress, and celebrate achievements.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Daily, weekly, and monthly tracking</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Category-wise breakdown (Transport, Energy, Food, Shopping)</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Personalized reduction targets</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Achievement badges and milestones</span>
                </li>
              </ul>
              {user && (
                <Link 
                  to="/app/add-footprint"
                  className="bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
                >
                  START TRACKING
                </Link>
              )}
            </div>
            
            <div className="animate-on-scroll">
              <img src={dashboardPreviewImage} alt="Carbon Tracker Dashboard" className="rounded-xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of users who have transformed their environmental impact with CarbonTracker.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg animate-on-scroll">
              <div className="flex items-start space-x-4">
                <img 
                  src={testimonials[currentTestimonial].image} 
                  alt={testimonials[currentTestimonial].name} 
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</p>
                    <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentTestimonial ? 'bg-gray-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join the Movement
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to start your sustainable lifestyle journey? Connect with our community and take the first step towards a greener future.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="animate-on-scroll">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">hello@carbontracker.app</p>
                </div>
              </div>
            </div>
            
            <div className="animate-on-scroll">
              <img src={contactImage} alt="Join CarbonTracker" className="rounded-xl shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CarbonTracker</h3>
              <p className="text-gray-400">
                Empowering individuals and businesses to reduce their carbon footprint and create a sustainable future.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link to="/footprint-form" className="hover:text-white">Add Footprint</Link></li>
                <li><Link to="/insights" className="hover:text-white">Insights</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <span className="text-gray-400">Twitter</span>
                <span className="text-gray-400">LinkedIn</span>
                <span className="text-gray-400">Instagram</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 CarbonTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-teal-300"
        aria-label="Open AI Carbon Coach"
      >
        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>
      
      <ChatbotInterface isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
    </div>
  );
}

export default LandingPage;