import React, { useState } from 'react';
import CG_logo from './Graphic/logo.png';


const Broadband = () => {
  const [step, setStep] = useState(1);
  const [postcode, setPostcode] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const encodedPostcode = encodeURIComponent(postcode.trim());
      const apiUrl = `http://docker.apx-gis.com:8039/api/v1/uprn/uprnByPostcode/${encodedPostcode}?token=vantage-08c86f0a-7177-4960-8811-1723`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setAddresses(data.map((item) => item.address)); // Populate addresses
        setStep(2); // Proceed to Step 2
      } else {
        // If no addresses found, move to the No Address step (Step 3)
        setAddresses([]);
        setStep(3);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setStep(3); // Fallback to the No Address step
    } finally {
      setLoading(false);
    }
  };

  const handlePostcodeSubmit = () => {
    if (!postcode.trim()) {
      alert('Please enter a valid postcode.');
      return;
    }
    fetchAddresses();
  };

  const handleBack = () => {
    setStep(1); // Go back to Step 1
    setAddresses([]); // Clear any previous addresses
  };

  const handleAddressSelect = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handlePostcodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, ''); // Allow only alphanumeric and spaces
    setPostcode(value);
  };
  
  const handlePostcodeBlur = () => {
    setPostcode((prev) => prev.trim());
  };
  
  return (
    <div className="text-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-600">Broadband Comparison</h1>

      <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-md">
        {/* Step 1: Postcode Input */}
        {step === 1 && (
          <>
            <label
              htmlFor="postcode"
              className="block text-lg font-medium mb-2 text-gray-600"
            >
              Enter your postcode:
            </label>
            <input
              id="postcode"
              type="text"
              value={postcode}
              onChange={handlePostcodeChange}
              onBlur={handlePostcodeBlur}
              className="border border-gray-300 p-2 w-full rounded-md text-gray-600"
              placeholder="e.g., SW1A 1AA"
            />
            <button
              onClick={handlePostcodeSubmit}
              className="bg-light-purple text-white px-4 py-2 mt-4 rounded-md hover:bg-light-purple-h transition duration-300"
            >
              {loading ? 'Loading...' : 'Next'}
            </button>
          </>
        )}

        {/* Step 2: Address Selection */}
        {step === 2 && (
          <>
            <label
              htmlFor="addressSelect"
              className="block text-lg font-medium mb-2 text-gray-600"
            >
              Select an address:
            </label>
            <select
              id="addressSelect"
              value={selectedAddress}
              onChange={handleAddressSelect}
              className="border border-gray-300 p-2 w-full rounded-md text-gray-600"
            >
              <option value="">-- Select Address --</option>
              {addresses.map((address, index) => (
                <option key={index} value={address}>
                  {address}
                </option>
              ))}
            </select>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="text-gray-500 px-4 py-2 rounded-md transition duration-300 hover:text-gray-700"
              >
                Back
              </button>
              <button
                disabled={!selectedAddress} // Disable Next button until an address is selected
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  selectedAddress
                    ? 'bg-light-purple text-white hover:bg-light-purple-h'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 3: No Address Found */}
{step === 3 && (
  <>
    <h2 className="text-lg font-medium text-gray-600 mb-4">
      We're awaiting the best deal for your area.
    </h2>
    <p className="text-gray-500 mb-4">
      Register your interest below, and we'll be in touch.
    </p>
    <img src={CG_logo} alt="Provider Logo" className="w-3/4 mx-auto mb-4" />
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
      {/* <h3 className="text-lg font-semibold mb-4 text-gray-600">
        Please enter your contact details
      </h3> */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="First Name"
          className="border border-gray-300 p-2 w-full rounded-md"
        />
        <input
          type="text"
          placeholder="Last Name"
          className="border border-gray-300 p-2 w-full rounded-md"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="border border-gray-300 p-2 w-full rounded-md"
        />
        <input
          type="email"
          placeholder="Email Address"
          className="border border-gray-300 p-2 w-full rounded-md"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
          />
          <label className="text-sm text-gray-600">
            I agree to be contacted regarding this offer
          </label>
        </div>
      </div>
    </div>
    <div className="flex justify-between mt-8">
      <button
        onClick={handleBack}
        className="flex items-center text-gray-500 px-4 py-2 rounded-md transition duration-300 hover:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <button
        className="bg-light-purple text-white px-4 py-2 rounded-md hover:bg-light-purple-h transition duration-300"
      >
        Finish
      </button>
    </div>
  </>
)}

      </div>
    </div>
  );
};

export default Broadband;
