import React, { useState, useRef } from 'react';
import TraineeSales from './Graphic/1.jpg';
import SalesRepresentative from './Graphic/2.jpg';

const Careers = () => {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const jobRefs = useRef({}); // Create references for each job

  const jobs = [
    {
      id: 1,
      title: 'Trainee Sales Associate',
      description: `Joining us as a SALES ASSOCIATE means being trained in the best sales techniques, earning uncapped commissions, growing your career in a fast-paced environment and being part of an enthusiastic, highly talented sales team. Representing a renowned brand like ScottishPower means you’ll be helping customers with their energy bills through direct marketing and showcasing Scottish Power’s award-winning products.`,
      benefits: [
        'Offices close to Birmingham city centre',
        'Weekly/Daily/Monthly incentive',
        'Open door policy – opportunity to learn from everyone in the business no matter their job title',
        'Enthusiastic, fast-paced environment',
        'Uncapped commission structure with chances to upsell our other products',
        'Attainable progression structure for motivated individuals',
        'Refer a friend scheme – earn £200 for each referral',
      ],
      requirements: [
        'Excellent communication and interpersonal skills',
        'Strong, confident personality',
        'Someone who wants to progress and build a career',
        'A target-driven mindset with a focus on exceeding goals',
        'Money-motivated individuals',
      ],
      extraDetails: [
        'If you want to be in sales and it seems employers need experience but no one will let you in the door to get it, I look forward to your application.',
        'As a Door to Door Sales Canvasser, you will represent our client, Scottish Power, a part of the Iberdrola group - one of the largest integrated utility companies and a world leader in wind energy.',
      ],
      jobTypes: 'Full-time, Permanent, Freelance',
      pay: 'From £11.44 per hour',
      location: 'Birmingham',
      image: TraineeSales,
      applyUrl: 'https://uk.indeed.com/cmp/Comparison-Guru/jobs?jk=cfdda5af46f8abfa&start=0&clearPrefilter=1#cmp-skip-header-desktop' 
    },
    {
      id: 2,
      title: 'Sales Representative',
      description: `Here at Comparison Guru we are seeking a motivated and results-driven Sales Representative to join our dynamic team. In this role, you will be responsible for building relationships with customers, identifying their needs, and providing tailored solutions to help them achieve their goals. As a door-to-door sales Canvasser, you will represent our client, Scottish Power, a part of the Iberdrola group - one of the largest integrated utility companies and a world leader in wind energy.`,
      responsibilities: [
        'Develop and maintain relationships with existing and potential customers.',
        'Identify customer needs and recommend appropriate products/services.',
        'Conduct sales presentations and demonstrations to showcase our offerings.',
        'Meet and exceed sales targets and objectives.',
      ],
      qualifications: [
        'Proven experience in sales or a related field.',
        'Excellent communication and interpersonal skills.',
        'Strong negotiation and closing abilities.',
        'Ability to work independently and as part of a team.',
      ],
      whatWeOffer: [
        'Competitive salary with performance-based bonuses.',
        'Comprehensive benefits package.',
        'Opportunities for professional growth and development.',
        'A supportive and inclusive work environment.',
        'Uncapped commission structure with chances to upsell our other products.',
      ],
      location: 'Cardiff & Glasgow',
      pay: 'From £11.44 per hour',
      jobTypes: 'Full-time, Permanent, Freelance',
      image: SalesRepresentative,
      applyUrl: 'https://uk.indeed.com/cmp/Comparison-Guru/jobs?jk=af35c7e2201b6498&start=0' 
    },
  ];

  const toggleJob = (id) => {
    setExpandedJobId((prevId) => {
      const newId = prevId === id ? null : id;

      if (newId) {
        setTimeout(() => {
          jobRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300); // Scroll after transition
      }

      return newId;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-600 mb-8 sm:mb-12 text-center">Careers</h1>
        
        <div className="space-y-6 sm:space-y-8">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105"
              ref={(el) => (jobRefs.current[job.id] = el)}
            >
              <div
                className="cursor-pointer p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between"
                onClick={() => toggleJob(job.id)}
              >
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <img src={job.image} alt={job.title} className="w-24 h-24 sm:w-40 sm:h-40 rounded-full object-cover" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-600">{job.title}</h2>
                </div>
                <p className="text-gray-600 text-xl sm:text-2xl mt-4 sm:mt-0">{expandedJobId === job.id ? '–' : '+'}</p>
              </div>
  
              {expandedJobId === job.id && (
                <div className="p-4 sm:p-8 transition-all duration-300">
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">{job.description}</p>
                  
                  {job.benefits && (
                    <>
                      <h3 className="text-lg sm:text-2xl font-semibold text-gray-600 mb-2 sm:mb-3">Benefits:</h3>
                      <ul className="list-disc pl-5 mb-4 sm:mb-6 text-base sm:text-lg text-gray-600">
                        {job.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </>
                  )}
  
                  {job.requirements && (
                    <>
                      <h3 className="text-lg sm:text-2xl font-semibold text-gray-600 mb-2 sm:mb-3">Requirements:</h3>
                      <ul className="list-disc pl-5 mb-4 sm:mb-6 text-base sm:text-lg text-gray-600">
                        {job.requirements.map((requirement, index) => (
                          <li key={index}>{requirement}</li>
                        ))}
                      </ul>
                    </>
                  )}
  
                  {job.extraDetails && (
                    <>
                      <h3 className="text-lg sm:text-2xl font-semibold text-gray-600 mb-2 sm:mb-3">Additional Details:</h3>
                      <ul className="list-disc pl-5 mb-4 sm:mb-6 text-base sm:text-lg text-gray-600">
                        {job.extraDetails.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </>
                  )}
  
                  {job.responsibilities && (
                    <>
                      <h3 className="text-lg sm:text-2xl font-semibold text-gray-600 mb-2 sm:mb-3">Key Responsibilities:</h3>
                      <ul className="list-disc pl-5 mb-4 sm:mb-6 text-base sm:text-lg text-gray-600">
                        {job.responsibilities.map((responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        ))}
                      </ul>
                    </>
                  )}
  
                  {job.qualifications && (
                    <>
                      <h3 className="text-lg sm:text-2xl font-semibold text-gray-600 mb-2 sm:mb-3">Qualifications:</h3>
                      <ul className="list-disc pl-5 mb-4 sm:mb-6 text-base sm:text-lg text-gray-600">
                        {job.qualifications.map((qualification, index) => (
                          <li key={index}>{qualification}</li>
                        ))}
                      </ul>
                    </>
                  )}
  
                  {job.whatWeOffer && (
                    <>
                      <h3 className="text-lg sm:text-2xl font-semibold text-gray-600 mb-2 sm:mb-3">What We Offer:</h3>
                      <ul className="list-disc pl-5 mb-4 sm:mb-6 text-base sm:text-lg text-gray-600">
                        {job.whatWeOffer.map((offer, index) => (
                          <li key={index}>{offer}</li>
                        ))}
                      </ul>
                    </>
                  )}
  
                  <p className="text-base sm:text-lg text-gray-600 mb-2 sm:mb-4">Job Types: {job.jobTypes}</p>
                  <p className="text-base sm:text-lg text-gray-600 mb-2 sm:mb-4">Location: {job.location}</p>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">Pay: {job.pay}</p>
  
                  <div className="text-center">
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-light-purple text-white py-2 px-6 sm:py-3 sm:px-8 rounded-full hover:bg-light-purple-h transition duration-300 text-base sm:text-lg"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Careers;




