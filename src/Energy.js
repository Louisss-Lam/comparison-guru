import React, { useState, useRef } from 'react';
import SpLogo from './Graphic/SpLogo.jpg';
import { useNavigate } from 'react-router-dom';

const Energy = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [postcode, setPostcode] = useState('');
  const [addresses, setAddresses] = useState([]); // Store the addresses from API
  const [selectedAddress, setSelectedAddress] = useState(''); // Track selected address
  const [isHomeowner, setIsHomeowner] = useState(null);
  const [energyType, setEnergyType] = useState(null);
  const [electricitySupplier, setElectricitySupplier] = useState('');
  const [otherSupplier, setOtherSupplier] = useState(''); // Track "Other" supplier name
  const [billPaymentMethod, setBillPaymentMethod] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth:'',
    phoneNumber: '',
    email: '',
    optIn: false,
  });

  const firstNameRef = useRef(null);

  const resetForm = () => {
    setStep(1); // Reset to the first step
    setCustomerDetails({
      firstName: '',
      lastName: '',
      dateOfBirth:'',
      phoneNumber: '',
      email: '',
      optIn: false,
    });
    setPostcode('');
    setIsHomeowner(null);
    setEnergyType(null);
    setElectricitySupplier('');
    setOtherSupplier('');
    setBillPaymentMethod('');
    setAddresses([]);
    setSelectedAddress('');
  };
  

  const handleNextStep = () => {
    if (step === 1 && addresses.length > 0) {
      setStep(1.5); // Move to Step 1.5 if addresses are available after postcode entry
    } else if (step === 1.5 && selectedAddress) {
      setStep(2); // Move to Step 2 only if an address is selected
    } else if (step < 6) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step === 1.5 ? 1 : step - 1); // Move back to Step 1 from Step 1.5
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomerDetails({
      ...customerDetails,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const progressPercentage = Math.round((step / 6) * 100);

  const scrollToFirstNameInput = () => {
    firstNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstNameRef.current?.focus();
  };

  // Fetch addresses based on postcode
  const fetchAddresses = async () => {
    try {
      const response = await fetch(`https://api.os.uk/search/places/v1/postcode?postcode=${postcode}&key=YcHtoYJ2LqKfG0ZMCbkKnkAGbFJCFVp4`);
      const data = await response.json();
      const addressResults = data.results.map(result => result.DPA.ADDRESS); // Extract addresses
      setAddresses(addressResults); // Update state with addresses
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const submitData = async () => {
    const ukPhoneRegex = /^(?:0|\+44)(?:\d\s?){9,10}$/;
  
    // Validate required fields
    if (!customerDetails.firstName) {
      alert('Please fill in your First Name.');
      return;
    }
    if (!customerDetails.lastName) {
      alert('Please fill in your Last Name.');
      return;
    }
    if (!customerDetails.dateOfBirth) {
      alert('Please fill in your Date Of Birth.');
      return;
    }
    if (!customerDetails.phoneNumber) {
      alert('Please fill in your Phone Number.');
      return;
    }
    if (!customerDetails.email) {
      alert('Please fill in your Email Address.');
      return;
    }
  
    // Validate opt-in checkbox
    if (!customerDetails.optIn) {
      alert('You must agree to be contacted regarding this offer to proceed.');
      return;
    }
  
    // Validate and format phone number
    let phoneNumber = customerDetails.phoneNumber.replace(/\s+/g, ''); // Remove any spaces
    if (!ukPhoneRegex.test(phoneNumber)) {
      alert('Please enter a valid UK phone number.');
      return;
    }
  
    // Format phone number for MaxContact compatibility
    if (phoneNumber.startsWith('+44')) {
      phoneNumber = phoneNumber.slice(3); // Remove '+44'
    } else if (phoneNumber.startsWith('0')) {
      phoneNumber = phoneNumber.slice(1); // Remove leading '0'
    }

    // Handle "Other" supplier
    const supplier = electricitySupplier === 'Other' ? otherSupplier : electricitySupplier;
  
    try {
      const response = await fetch('https://www.comparison-guru.co.uk/save_customer_info.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          first_name: customerDetails.firstName,
          last_name: customerDetails.lastName,
          date_of_birth: customerDetails.dateOfBirth,
          phone_number: phoneNumber,
          email: customerDetails.email,
          opt_in: customerDetails.optIn ? 'Yes' : 'No',
          postcode: postcode,
          is_homeowner: isHomeowner ? 'Yes' : 'No',
          energy_type: energyType,
          electricity_supplier: supplier, // Use the resolved supplier value
          bill_payment_method: billPaymentMethod,
          address: selectedAddress,
        }),
      });
  
      const result = await response.text();
        if (response.ok) {
            navigate('/confirmation'); // Redirect to Confirmation page after success
        } else {
            alert(`Error: ${result}`);
        }
    } catch (error) {
        console.error('Submission error:', error);
        alert('An error occurred while submitting data. Please try again.');
    }

  };
  
  
    const suppliers = [
    'British Gas', 'Eon', 'Octopus', 'Shell Energy',
    'ScottishPower', 'EDF', 'SSE', 'Utility Warehouse', 'Other'
  ];
  
  return (
    <div className="text-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-600">Energy Comparison</h1>

      {/* Progress Bar */}
      <div className="relative w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
        <div
          className="bg-light-purple h-4 rounded-full transition-all duration-300 flex items-center justify-center text-white text-xs font-semibold"
          style={{ width: `${progressPercentage}%` }}
        >
          {progressPercentage}%
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-md">
        {/* Step 1: Enter Postcode */}
        {step === 1 && (
  <div>
    <label htmlFor="postcode" className="block text-lg font-medium mb-2 text-gray-600">Enter your postcode:</label>
    <input
      id="postcode"
      type="text"
      value={postcode}
      onChange={(e) => setPostcode(e.target.value)}
      onBlur={fetchAddresses} // Trigger address fetch on blur
      className="border border-gray-300 p-2 w-full rounded-md text-gray-600"
      placeholder="e.g., SW1A 1AA"
    />
 
  </div>
)}

{/* Step 1.5: Select Address */}
{step === 1.5 && addresses.length > 0 && (
  <div className="address-list mt-4">
    <p className="text-lg font-medium text-gray-600 mb-2">Select an address:</p>
    <select
      value={selectedAddress}
      onChange={(e) => setSelectedAddress(e.target.value)}
      className="border border-gray-300 p-2 w-full rounded-md text-gray-600"
    >
      <option value="">-- Select Address --</option>
      {addresses.map((address, index) => (
        <option key={index} value={address}>{address}</option>
      ))}
    </select>
  </div>
)}
        {/* Step 2: Are you a Homeowner? */}
        {step === 2 && (
          <div>
            <p className="text-lg font-medium mb-4 text-gray-600">Are you a homeowner?</p>
            <div className="flex justify-around">
              <button
                onClick={() => setIsHomeowner(true)}
                className={`px-4 py-2 rounded-md text-gray-600 ${isHomeowner === true ? 'bg-light-purple text-white' : 'bg-gray-200'} hover:bg-light-purple-h hover:text-white`}
              >
                Yes
              </button>
              <button
                onClick={() => setIsHomeowner(false)}
                className={`px-4 py-2 rounded-md text-gray-600 ${isHomeowner === false ? 'bg-light-purple text-white' : 'bg-gray-200'} hover:bg-light-purple-h hover:text-white`}
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Gas and Electricity Options */}
        {step === 3 && (
          <div>
            <p className="text-lg font-medium mb-4 text-gray-600">Does your home have both gas and electricity?</p>
            <div className="flex justify-around">
              <button
                onClick={() => setEnergyType('Both')}
                className={`px-4 py-2 rounded-md text-gray-600 ${energyType === 'Both' ? 'bg-light-purple text-white' : 'bg-gray-200'} hover:bg-light-purple-h hover:text-white`}
              >
                Yes, Both
              </button>
              <button
                onClick={() => setEnergyType('Electricity Only')}
                className={`px-4 py-2 rounded-md text-gray-600 ${energyType === 'Electricity Only' ? 'bg-light-purple text-white' : 'bg-gray-200'} hover:bg-light-purple-h hover:text-white`}
              >
                Electricity Only
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Electricity Supplier Selection */}
        {step === 4 && (
          <div>
            <p className="text-lg font-medium mb-4 text-gray-600">Who is your current electricity supplier?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {suppliers.map((supplier) => (
                <button
                  key={supplier}
                  onClick={() => {
                    setElectricitySupplier(supplier);
                    if (supplier !== 'Other') setOtherSupplier(''); // Reset other supplier field if different option selected
                  }}
                  className={`px-2 py-2 rounded-lg border-2 transition duration-300 text-sm text-center font-medium  ${
                    electricitySupplier === supplier
                      ? 'bg-light-purple text-white border-light-purple'
                      : 'bg-white text-gray-600 border-light-purple'
                  } hover:bg-light-purple hover:text-white`}
                >
                  {supplier}
                </button>
              ))}
            </div>

            {/* Show additional input when "Other" is selected */}
            {electricitySupplier === 'Other' && (
              <div className="mt-6">
                <label htmlFor="otherSupplier" className="block text-lg font-medium mb-2 text-gray-600">
                  Please specify your supplier:
                </label>
                <input
                  id="otherSupplier"
                  type="text"
                  value={otherSupplier}
                  onChange={(e) => setOtherSupplier(e.target.value)}
                  className="border border-light-purple p-2 w-full rounded-md"
                  placeholder="Enter supplier name"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 5: Bill Payment Method */}
        {step === 5 && (
          <div>
            <p className="text-lg font-medium mb-4 text-gray-600">How do you normally pay for your bills?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Direct Debit', 'Prepayment Meter', 'Other'].map((method) => (
                <button
                  key={method}
                  onClick={() => setBillPaymentMethod(method)}
                  className={`px-4 py-4 rounded-lg border-2 transition duration-300 font-medium text-sm text-center text-gray-600 ${
                    billPaymentMethod === method
                      ? 'bg-light-purple text-white border-light-purple'
                      : 'bg-white text-gray-700 border-light-purple'
                  } hover:bg-light-purple hover:text-white`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Offer */}
        {step === 6 && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <div className="bg-light-purple text-white text-lg font-semibold rounded-full px-4 py-1 inline-block mb-4">
                We've found you an offer!
              </div>
              <div className="text-center mb-4">
                <p className="text-gray-500">Provider:</p>
                <img src={SpLogo} alt="Provider Logo" className="w-3/4 mx-auto mb-4" />
              </div>
              <p className="text-lg font-medium text-gray-600 mb-4">Why Choose ScottishPower?</p>
              <ul className="text-left mb-6 space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2">✔️</span> Half price energy at weekends  
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✔️</span> 100% green electricity
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✔️</span> No exit fees moving between our tariffs
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✔️</span> Flexi & Cap tracking tariffs available
                </li>
              </ul>
              <button
                onClick={scrollToFirstNameInput}
                className="bg-light-purple text-white font-semibold py-3 px-8 rounded-lg hover:bg-light-purple-h transition duration-300"
              >
                Find Out More
              </button>
            </div>

            {/* Customer Information Form */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-600">Please enter your contact details</h3>
              <div className="space-y-4">
                <input
                  ref={firstNameRef} // Ref for scrolling
                  type="text"
                  name="firstName"
                  value={customerDetails.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                <input
                  type="text"
                  name="lastName"
                  value={customerDetails.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                {/* Date of Birth Field */}

                <label className="block text-gray-600">
  Date of Birth:<span className="mr-2"></span>
  <input
    type="date"
    name="dateOfBirth"
    value={customerDetails.dateOfBirth}
    onChange={handleInputChange}
    className="border border-gray-300 p-2 w-full rounded-md text-gray-600 bg-white"
    onFocus={(e) => e.target.showPicker && e.target.showPicker()}
  />
</label>

                <input
                  type="tel"
                  name="phoneNumber"
                  value={customerDetails.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                <input
                  type="email"
                  name="email"
                  value={customerDetails.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="border border-gray-300 p-2 w-full rounded-md"
                />
                <div className="flex items-start space-x-2">
  <input
    id="optIn"
    type="checkbox"
    name="optIn"
    checked={customerDetails.optIn}
    onChange={handleInputChange}
    className="mt-1"
  />
  <label htmlFor="optIn" className="text-sm text-gray-600 text-left">
  By clicking the Submit button you confirm that you are over 18 years of age, 
  responsible for paying your energy bills and agree to receive a call from 
  ScottishPower on 0121 732 9512. Your data will be processed in accordance with our&nbsp;
  <a href="https://www.comparison-guru.co.uk/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-light-purple underline hover:text-dark-purple">
    privacy policy
  </a>.
</label>

</div>
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
<div className="flex justify-between mt-8">
    <button
        onClick={handlePreviousStep}
        className="flex items-center text-gray-500 px-4 py-2 rounded-md transition duration-300"
        disabled={step === 1} // Disable 'Back' on the first step
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

    {step < 6 ? (
        <button
            onClick={handleNextStep}
            className="bg-light-purple text-white px-4 py-2 mr-6 rounded-md hover:bg-light-purple-h transition duration-300"
            disabled={
                (step === 1 && (!postcode || addresses.length === 0)) || // Step 1: Require postcode and fetched addresses
                (step === 1.5 && !selectedAddress) || // Step 1.5: Require selected address
                (step === 2 && isHomeowner === null) || // Step 2: Require homeowner selection
                (step === 3 && !energyType) || // Step 3: Require energy type
                (step === 4 && (!electricitySupplier || (electricitySupplier === 'Other' && !otherSupplier))) || // Step 4: Require supplier or "Other" name
                (step === 5 && !billPaymentMethod) // Step 5: Require bill payment method
            }
        >
            Next
        </button>
    ) : (
      <button
  onClick={submitData}
  className="bg-light-purple text-white px-4 py-2 rounded-md hover:bg-light-purple-h transition duration-300"
>
  Submit
</button>


    
    )}
</div>

      </div>
    </div>
  );
};

export default Energy;




// import React, { useState, useRef } from 'react';
// import SpLogo from './Graphic/SpLogo.jpg';

// const Energy = () => {
//   const [step, setStep] = useState(1);
//   const [postcode, setPostcode] = useState('');
//   const [isHomeowner, setIsHomeowner] = useState(null);
//   const [energyType, setEnergyType] = useState(null);
//   const [electricitySupplier, setElectricitySupplier] = useState('');
//   const [otherSupplier, setOtherSupplier] = useState(''); // Track "Other" supplier name
//   const [billPaymentMethod, setBillPaymentMethod] = useState('');
//   const [customerDetails, setCustomerDetails] = useState({
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//     email: '',
//     optIn: false,
//   });

//   const firstNameRef = useRef(null);

//   const handleNextStep = () => {
//     if (step < 6) setStep(step + 1);
//   };

//   const handlePreviousStep = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setCustomerDetails({
//       ...customerDetails,
//       [name]: type === 'checkbox' ? checked : value,
//     });
//   };

//   const progressPercentage = Math.round((step / 6) * 100);

//   const scrollToFirstNameInput = () => {
//     firstNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     firstNameRef.current?.focus();
//   };

//   const submitData = async () => {
//     try {
//       const response = await fetch('https://www.comparison-guru.co.uk/save_customer_info.php', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//           first_name: customerDetails.firstName,
//           last_name: customerDetails.lastName,
//           phone_number: customerDetails.phoneNumber,
//           email: customerDetails.email,
//           opt_in: customerDetails.optIn ? '1' : '0',
//           postcode: postcode,
//           is_homeowner: isHomeowner ? '1' : '0',
//           energy_type: energyType,
//           electricity_supplier: electricitySupplier,
//           other_supplier: otherSupplier,
//           bill_payment_method: billPaymentMethod,
//         }),
//       });
  
//       const result = await response.text();
//       if (response.ok) {
//         alert("Data submitted successfully!");
//         // Optionally, you could reset the form after submission
//         setStep(1); // Reset to first step
//         setCustomerDetails({
//           firstName: '',
//           lastName: '',
//           phoneNumber: '',
//           email: '',
//           optIn: false,
//         });
//         setPostcode('');
//         setIsHomeowner(null);
//         setEnergyType(null);
//         setElectricitySupplier('');
//         setOtherSupplier('');
//         setBillPaymentMethod('');
//       } else {
//         alert(`Error: ${result}`);
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       alert("An error occurred while submitting data. Please try again.");
//     }
//   };
  
  

//   const suppliers = [
//     'British Gas', 'Eon', 'Octopus', 'Shell Energy',
//     'ScottishPower', 'EDF', 'SSE', 'Utility Warehouse', 'Other'
//   ];

//   return (
//     <div className="text-center p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-semibold mb-6 text-gray-600">Energy Comparison</h1>

//       {/* Progress Bar */}
//       <div className="relative w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
//         <div
//           className="bg-light-purple h-4 rounded-full transition-all duration-300 flex items-center justify-center text-white text-xs font-semibold"
//           style={{ width: `${progressPercentage}%` }}
//         >
//           {progressPercentage}%
//         </div>
//       </div>

//       <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-md">
//         {/* Step 1: Enter Postcode */}
//         {step === 1 && (
//           <div>
//             <label htmlFor="postcode" className="block text-lg font-medium mb-2 text-gray-600">Enter your postcode:</label>
//             <input
//               id="postcode"
//               type="text"
//               value={postcode}
//               onChange={(e) => setPostcode(e.target.value)}
//               className="border border-gray-300 p-2 w-full rounded-md text-gray-600"
//               placeholder="e.g., SW1A 1AA"
//             />
//           </div>
//         )}

//         {/* Step 2: Are you a Homeowner? */}
//         {step === 2 && (
//           <div>
//             <p className="text-lg font-medium mb-4 text-gray-600">Are you a homeowner?</p>
//             <div className="flex justify-around">
//               <button
//                 onClick={() => setIsHomeowner(true)}
//                 className={`px-4 py-2 rounded-md text-gray-600 ${isHomeowner === true ? 'bg-light-purple text-white' : 'bg-gray-200'} hover:bg-light-purple-h hover:text-white`}
//               >
//                 Yes
//               </button>
//               <button
//                 onClick={() => setIsHomeowner(false)}
//                 className={`px-4 py-2 rounded-md text-gray-600 ${isHomeowner === false ? 'bg-light-purple text-white' : 'bg-gray-200'} hover:bg-light-purple-h hover:text-white`}
//               >
//                 No
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Step 3: Gas and Electricity Options */}
//         {step === 3 && (
//           <div>
//             <p className="text-lg font-medium mb-4 text-gray-600">Does your home have both gas and electricity?</p>
//             <div className="flex justify-around">
//               <button
//                 onClick={() => setEnergyType('Both')}
//                 className={`px-4 py-2 rounded-md text-gray-600 ${energyType === 'Both' ? 'bg-light-purple text-white' : 'bg-gray-200'} hover:bg-light-purple-h hover:text-white`}
//               >
//                 Yes, Both
//               </button>
//               <button
//                 onClick={() => setEnergyType('Electricity Only')}
//                 className={`px-4 py-2 rounded-md text-gray-600 ${energyType === 'Electricity Only' ? 'bg-light-purple text-white' : 'bg-gray-200'} hover:bg-light-purple-h hover:text-white`}
//               >
//                 Electricity Only
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Step 4: Electricity Supplier Selection */}
//         {step === 4 && (
//           <div>
//             <p className="text-lg font-medium mb-4 text-gray-600">Who is your current electricity supplier?</p>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {suppliers.map((supplier) => (
//                 <button
//                   key={supplier}
//                   onClick={() => {
//                     setElectricitySupplier(supplier);
//                     if (supplier !== 'Other') setOtherSupplier(''); // Reset other supplier field if different option selected
//                   }}
//                   className={`px-2 py-2 rounded-lg border-2 transition duration-300 text-sm text-center font-medium  ${
//                     electricitySupplier === supplier
//                       ? 'bg-light-purple text-white border-light-purple'
//                       : 'bg-white text-gray-600 border-light-purple'
//                   } hover:bg-light-purple hover:text-white`}
//                 >
//                   {supplier}
//                 </button>
//               ))}
//             </div>

//             {/* Show additional input when "Other" is selected */}
//             {electricitySupplier === 'Other' && (
//               <div className="mt-6">
//                 <label htmlFor="otherSupplier" className="block text-lg font-medium mb-2 text-gray-600">
//                   Please specify your supplier:
//                 </label>
//                 <input
//                   id="otherSupplier"
//                   type="text"
//                   value={otherSupplier}
//                   onChange={(e) => setOtherSupplier(e.target.value)}
//                   className="border border-light-purple p-2 w-full rounded-md"
//                   placeholder="Enter supplier name"
//                 />
//               </div>
//             )}
//           </div>
//         )}

//         {/* Step 5: Bill Payment Method */}
//         {step === 5 && (
//           <div>
//             <p className="text-lg font-medium mb-4 text-gray-600">How do you normally pay for your bills?</p>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {['Direct Debit', 'Prepayment Meter', 'Other'].map((method) => (
//                 <button
//                   key={method}
//                   onClick={() => setBillPaymentMethod(method)}
//                   className={`px-4 py-4 rounded-lg border-2 transition duration-300 font-medium text-sm text-center text-gray-600 ${
//                     billPaymentMethod === method
//                       ? 'bg-light-purple text-white border-light-purple'
//                       : 'bg-white text-gray-700 border-light-purple'
//                   } hover:bg-light-purple hover:text-white`}
//                 >
//                   {method}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Step 6: Offer */}
//         {step === 6 && (
//           <>
//             <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
//               <div className="bg-light-purple text-white text-lg font-semibold rounded-full px-4 py-1 inline-block mb-4">
//                 We've found you an offer!
//               </div>
//               <div className="text-center mb-4">
//                 <p className="text-gray-500">Provider:</p>
//                 <img src={SpLogo} alt="Provider Logo" className="w-3/4 mx-auto mb-4" />
//               </div>
//               <p className="text-lg font-medium text-gray-600 mb-4">Why Choose ScottishPower?</p>
//               <ul className="text-left mb-6 space-y-2 text-gray-600">
//                 <li className="flex items-center">
//                   <span className="mr-2">✔️</span> 100% green electricity
//                 </li>
//                 <li className="flex items-center">
//                   <span className="mr-2">✔️</span> Zero CO2 emissions on your electricity
//                 </li>
//                 <li className="flex items-center">
//                   <span className="mr-2">✔️</span> Fixed prices for up to 2 years
//                 </li>
//                 <li className="flex items-center">
//                   <span className="mr-2">✔️</span> No exit fees moving between our tariffs
//                 </li>
//               </ul>
//               <button
//                 onClick={scrollToFirstNameInput}
//                 className="bg-light-purple text-white font-semibold py-3 px-8 rounded-lg hover:bg-light-purple-h transition duration-300"
//               >
//                 Find Out More
//               </button>
//             </div>

//             {/* Customer Information Form */}
//             <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
//               <h3 className="text-lg font-semibold mb-4 text-gray-600">Please enter your contact details</h3>
//               <div className="space-y-4">
//                 <input
//                   ref={firstNameRef} // Ref for scrolling
//                   type="text"
//                   name="firstName"
//                   value={customerDetails.firstName}
//                   onChange={handleInputChange}
//                   placeholder="First Name"
//                   className="border border-gray-300 p-2 w-full rounded-md"
//                 />
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={customerDetails.lastName}
//                   onChange={handleInputChange}
//                   placeholder="Last Name"
//                   className="border border-gray-300 p-2 w-full rounded-md"
//                 />
//                 <input
//                   type="tel"
//                   name="phoneNumber"
//                   value={customerDetails.phoneNumber}
//                   onChange={handleInputChange}
//                   placeholder="Phone Number"
//                   className="border border-gray-300 p-2 w-full rounded-md"
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   value={customerDetails.email}
//                   onChange={handleInputChange}
//                   placeholder="Email Address"
//                   className="border border-gray-300 p-2 w-full rounded-md"
//                 />
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="optIn"
//                     checked={customerDetails.optIn}
//                     onChange={handleInputChange}
//                     className="mr-2"
//                   />
//                   <label htmlFor="optIn" className="text-sm text-gray-600">I agree to be contacted regarding this offer</label>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Navigation Buttons */}
//         <div className="flex justify-between mt-8">
//             <button
//               onClick={handlePreviousStep}
//               className="flex items-center text-gray-500 px-4 py-2 rounded-md transition duration-300"
//               disabled={step === 1}
//             >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-4 w-4 mr-2"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//       </svg>
//       Back
//     </button>
//           {step < 6 ? (
//             <button
//               onClick={handleNextStep}
//               className="bg-light-purple text-white px-4 py-2 mr-6 rounded-md hover:bg-light-purple-h transition duration-300"
//               disabled={
//                 (step === 1 && !postcode) ||
//                 (step === 2 && isHomeowner === null) ||
//                 (step === 3 && !energyType) ||
//                 (step === 4 && (!electricitySupplier || (electricitySupplier === 'Other' && !otherSupplier))) ||
//                 (step === 5 && !billPaymentMethod)
//               }
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               onClick={submitData}
//               className="bg-light-purple text-white px-4 py-2 rounded-md hover:bg-light-purple-h transition duration-300"
//             >
//               Finish
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Energy;




