import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import usePageTracking from './usePageTracking';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ComingSoon from './Graphic/comingSoon.png';
import Logo from './Graphic/logo.png';
import Energy from './Energy';
import Broadband from './Broadband';
import Careers from './Careers';
import PrivacyPolicy from './PrivacyPolicy';
import Confirmation from './Confirmation';
import HeroBanner from './Graphic/heroBanner.jpg';
import Step1Image from './Graphic/search.png';
import Step2Image from './Graphic/chat.png';
import Step3Image from './Graphic/savings.png';
import BroadbandBanner from './Graphic/CGbroadbband.jpg';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const TRACKING_ID = "G-B8K8102CNC";

const App = () => {
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    ReactGA.send({ 
      hitType: "pageview", 
      page: window.location.pathname, 
      title: "App.js"
    });
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex-shrink-0">
                <img src={Logo} alt="Comparison Guru Logo" className="h-10 w-auto sm:h-12" />
              </div>
              <div className="hidden md:flex space-x-8 text-light-purple items-center">
                <Link to="/" className="flex items-center text-lg font-medium hover:text-light-purple-h transition duration-300">
                  <i className="fas fa-home mr-2"></i> Home
                </Link>
                <Link to="/energy" className="flex items-center text-lg font-medium hover:text-light-purple-h transition duration-300">
                  <i className="fas fa-bolt mr-2"></i> Energy
                </Link>
                <Link to="/broadband" className="flex items-center text-lg font-medium hover:text-light-purple-h transition duration-300">
                  <i className="fas fa-wifi mr-2"></i> Broadband
                </Link>
                <Link to="/careers" className="flex items-center text-lg font-medium hover:text-light-purple-h transition duration-300">
                  <i className="fas fa-briefcase mr-2"></i> Careers
                </Link>
                <Link to="/privacy-policy" className="flex items-center text-lg font-medium hover:text-light-purple-h transition duration-300">
                  <i className="fas fa-shield-alt mr-2"></i> Privacy Policy
                </Link>
              </div>
              <div className="md:hidden flex items-center">
                <button
                  className="text-light-purple focus:outline-none"
                  onClick={() => document.getElementById('mobile-menu').classList.toggle('hidden')}
                >
                  <i className="fas fa-bars text-xl"></i>
                </button>
              </div>
            </div>
          </nav>
          <div id="mobile-menu" className="md:hidden hidden bg-white shadow-lg">
            <div className="flex flex-col p-4 space-y-4 text-light-purple">
              <Link to="/" className="text-lg font-medium hover:text-light-purple-h transition duration-300">Home</Link>
              <Link to="/energy" className="text-lg font-medium hover:text-light-purple-h transition duration-300">Energy</Link>
              <Link to="/broadband" className="text-lg font-medium hover:text-light-purple-h transition duration-300">Broadband</Link>
              <Link to="/careers" className="text-lg font-medium hover:text-light-purple-h transition duration-300">Careers</Link>
              <Link to="/privacy-policy" className="text-lg font-medium hover:text-light-purple-h transition duration-300">Privacy Policy</Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow bg-gray-100 p-4">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  {/* Hero Banner */}
                  <div className="mb-12 text-center">
                    <img src={HeroBanner} alt="Energy Supplier Comparison Now Live" className="w-full h-auto" />
                  </div>

                  {/* How It Works Section */}
                  <div className="max-w-7xl mx-auto text-center mb-20">
                    <h2 className="text-3xl font-bold text-light-purple">How It Works</h2>
                    <p className="text-lg text-gray-600">Follow these simple steps to start saving money on your energy bills.</p>
                  </div>

                  {/* 3 Steps Section */}
<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
  {/* Step 1 */}
  <div className="flex flex-col items-center">
    <img src={Step1Image} alt="Step 1" className="w-16 h-16 mb-4" />
    <h3 className="text-xl font-bold mb-2 text-light-purple">Find the Best Tariffs</h3>
    <p className="text-gray-600">Our team will compare tariffs across suppliers to bring you the best available deals, saving you time and money.</p>
  </div>

  {/* Step 2 */}
  <div className="flex flex-col items-center">
    <img src={Step2Image} alt="Step 2" className="w-16 h-16 mb-4" />
    <h3 className="text-xl font-bold mb-2 text-light-purple">Get Contacted by Experts</h3>
    <p className="text-gray-600">Our partners will reach out to you with market-leading deals tailored to your needs.</p>
  </div>

  {/* Step 3 */}
  <div className="flex flex-col items-center">
    <img src={Step3Image} alt="Step 3" className="w-16 h-16 mb-4" />
    <h3 className="text-xl font-bold mb-2 text-light-purple">Stay Smart, Save Money</h3>
    <p className="text-gray-600">We keep you informed of market changes so you’re never paying more than you should.</p>
  </div>
</div>


                  {/* Call to Action Buttons (Side by Side) */}
<div className="flex justify-center space-x-16 mb-12">
  <Link to="/energy" className="bg-light-purple text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-dark-purple transition duration-300">
    Compare Energy Deals
  </Link>
  <Link to="/broadband" className="bg-light-purple text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-dark-purple transition duration-300">
    Find the Best Broadband Plan
  </Link>
</div>

                  {/* Broadband Coming Soon Banner */}
                  {/* <div className="text-center">
                    <img src={BroadbandBanner} alt="Broadband Coming Soon" className="w-full h-auto" />
                  </div> */}
                </div>
              }
            />

            {/* Energy Page Route */}
            <Route path="/energy" element={<Energy />} />

            {/* Broadband Page Route */}
            <Route path="/broadband" element={<Broadband />} />

            {/* Careers Page Route */}
            <Route path="/careers" element={<Careers />} />

            {/* Privacy Policy Page Route */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            
            {/* Confirmation */}
            <Route path="/confirmation" element={<Confirmation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
