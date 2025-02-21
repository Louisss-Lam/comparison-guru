import React from 'react';
import Logo from './Graphic/CG_logo.png'; // Ensure the correct path to your logo

const Confirmation = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">

      {/* Thank You Message */}
      <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md flex flex-col items-center">
        {/* Company Logo - Centered */}
        <div className="flex justify-center">
          <img src={Logo} alt="Company Logo" className="w-52 h-52 mb-6" />
        </div>

        <h2 className="text-2xl font-semibold text-light-purple mb-4">Thank You!</h2>
        <p className="text-gray-600 text-lg">
          Your details have been submitted successfully.
        </p>
        <p className="text-gray-600 text-lg mt-2">
          Keep an eye out for a call from:
        </p>
        <p className="text-xl font-bold text-light-purple mt-2">
          0121 732 9730
        </p>
        <p className="text-gray-600 text-sm mt-4">
          We’ll be in touch soon!
        </p>
      </div>
    </div>
  );
};

export default Confirmation;
