import React, { useState } from 'react';
import CG_logo from './Graphic/logo.png';
import Exclusive from './Graphic/Exclusive.jpg';

const Broadband = () => {
  const [step, setStep] = useState(1);
  const [postcode, setPostcode] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    currentSupplier: '', 
    isHomeowner: '', 
    agreeToContact: false, 
    postcode: '', 
    selectedAddress: '', 
  });
  

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const encodedPostcode = encodeURIComponent(postcode.trim());
      const apiUrl = `https://fibreos.freshfibre.co.uk/api/v1/uprn/uprnByPostcode/${encodedPostcode}?token=vantage-2f025b70-5f93-0d72-4fd8-d013`;

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

  const handleBack = (prevStep) => {
    setStep(prevStep); // Go back to the previous step
    if (prevStep === 1) {
      setAddresses([]); // Clear any previous addresses
    }
  };

  const handleAddressSelect = (event) => {
    const value = event.target.value;
    setSelectedAddress(value);
    setFormData((prev) => ({
      ...prev,
      selectedAddress: value,
    }));
  };
  

  const handleNext = () => {
    if (step === 2 && selectedAddress) {
      setStep(4); // Move to Step 4
    }
  };

  const handlePostcodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, ''); // Allow only alphanumeric and spaces
    setPostcode(value);
    setFormData((prev) => ({
      ...prev,
      postcode: value,
    }));
  };
  

  const handlePostcodeBlur = () => {
    setPostcode((prev) => prev.trim());
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validatePhoneNumber = (phone) => {
    const ukPhoneRegex = /^(?:\+44|0)7\d{8,9}$/; 
    return ukPhoneRegex.test(phone);
  };
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.email) {
      alert('❌ Please complete all required fields.');
      return false;
    }
    
    if (!validatePhoneNumber(formData.phoneNumber)) {
      alert('❌ Please enter a valid UK phone number (starting with +44 or 07).');
      return false;
    }
  
    if (!validateEmail(formData.email)) {
      alert('❌ Please enter a valid email address.');
      return false;
    }
  
    if (!formData.agreeToContact) {
      alert('❌ You must agree to be contacted.');
      return false;
    }
  
    return true;
  };

  const handleFinish = async (e) => {
    e.preventDefault();

    // Validate form data before submission
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('https://www.comparison-guru.co.uk/submit_data_bb.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Form submitted successfully!');
        // Clear form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          currentSupplier: '',
          isHomeowner: '',
          agreeToContact: false,
          postcode: '',
          selectedAddress: '',
        });
        setStep(1); // Reset to Step 1
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
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
                onClick={() => handleBack(1)}
                className="text-gray-500 px-4 py-2 rounded-md transition duration-300 hover:text-gray-700"
              >
                Back
              </button>
              <button
                onClick={handleNext}
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
              <div className="space-y-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleFormChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleFormChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                <div className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToContact"
                  checked={formData.agreeToContact}
                  onChange={handleFormChange}
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
                onClick={() => handleBack(1)}
                className="text-gray-500 px-4 py-2 rounded-md transition duration-300 hover:text-gray-700"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="bg-light-purple text-white px-4 py-2 rounded-md hover:bg-light-purple-h transition duration-300"
              >
                Finish
              </button>
            </div>
          </>
        )}

        {/* Step 4: Custom Page After Address Selection */}
        {step === 4 && (
          <>
            <h2 className="text-lg font-medium text-gray-600 mb-4">
              Unlock Your Exclusive Deal - Just for You!
            </h2>
            <img src={Exclusive} alt="Provider Logo" className="w-4/4 mx-auto mb-4" />
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
              <div className="space-y-4">
              <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleFormChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleFormChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                <input
                  type="text"
                  name="currentSupplier"
                  placeholder="Current Supplier"
                  value={formData.currentSupplier}
                  onChange={handleFormChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                <input
                  type="text"
                  name="isHomeowner"
                  placeholder="Are you a homeowner?"
                  value={formData.isHomeowner}
                  onChange={handleFormChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="agreeToContact"
                    checked={formData.agreeToContact}
                    onChange={handleFormChange}
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
                onClick={() => handleBack(1)}
                className="text-gray-500 px-4 py-2 rounded-md transition duration-300 hover:text-gray-700"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
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
