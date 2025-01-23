import React from 'react';
import ComingSoon from './Graphic/comingSoon.png';

const Broadband = () => {
  return (
    <div className="text-center">
                  {/* Coming Soon Image */}
                  <div className="mb-8">
                    <img
                      src={ComingSoon}
                      alt="Coming Soon"
                      className="w-8/12 mx-auto"
                    />
                  </div>
                </div>
  )
}

export default Broadband