import React, { useEffect, useState } from 'react';
import '../../Styles/CreateUser/createuser.css'; 
import axiosInstance from '../../interceptor/axiosInstance';
import { FaCheck } from "react-icons/fa";
import Contact from '../Contact/Contact'; // Ensure to import your Contact component
import Modal from './Model';

const Upgrade = () => {
  const [packages, setPackages] = useState([]);
  const [showContact, setShowContact] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_1INV8v0NtmbOlW";
  const orgId = parseInt(localStorage.getItem("org_id"), 10);
  const [assessmentNames, setAssessmentNames] = useState([]);
  const [assessmentCosts, setAssessmentCosts] = useState({}); // State to hold assessment costs for each package
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message
   const [assessmentCard, setAssessmentCard] = useState([])


  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axiosInstance.get('/upgrade/upgrade/');
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching upgrade packages:', error);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axiosInstance.get(`/upgrade/assessments/`);
        setAssessmentNames(response.data.results); // Assuming response.data contains assessment objects with id and name
      } catch (error) {
        console.error('Error fetching assessments:', error);
      }
    };
    fetchAssessments();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payNow = async (cost, title, id, assessment_id) => {
    if (!cost) {
      alert('Price not available');
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    try {
      const { data: order } = await axiosInstance.post(`/upgrade/upgrade_package/${id}/pay/`, { org_id: orgId, assessment_id });

      const options = {
        key: key_id,
        amount: order.cost,
        name: title,
        description: 'Payment for Upgrade Package',
        order_id: order.razorpay_order_id,
        handler: async function (response) {
          try {
            await axiosInstance.post('/upgrade/upgrade_package/payment_confirmation/', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              org_id: orgId,
              upgrade_id: id,
              assessment_id // Include the assessment_id here
            });
            alert('Payment is Done');
          } catch (err) {
            alert('Payment verification failed');
            console.error('Payment Verification Error', err.response ? err.response.data : err.message);
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Something went wrong while creating the order');
    }
  };

  const handleGetStartedClick = (pkg) => {
    const assessmentCost = assessmentCosts[pkg.id]?.cost || 0;
    const assessmentId = assessmentCosts[pkg.id]?.id;

    // Check if an assessment is selected for non-gold packages
    if (pkg.name.toLowerCase() === 'gold') {
      setShowContact(true);
      setSelectedPackage(pkg);
    } else if (!assessmentId) {
      setErrorMessage("Please select an assessment before proceeding.");
    } else {
      setErrorMessage(""); // Clear the error message
      payNow(pkg.cost + assessmentCost, pkg.name, pkg.id, assessmentId);
    }
  };

  const handleAssessmentChange = (pkgId, assessmentId) => {
    const assessment = assessmentNames.find((assessment) => assessment.id === parseInt(assessmentId));
    if (assessment) {
      setAssessmentCosts((prevCosts) => ({
        ...prevCosts,
        [pkgId]: { id: assessment.id, cost: assessment.cost },
      }));
      setErrorMessage(""); // Clear error when a valid assessment is selected
    } else {
      setAssessmentCosts((prevCosts) => {
        const { [pkgId]: removed, ...rest } = prevCosts;
        return rest;
      });
    }
  };


  //Assessment Card API call Here 
  useEffect(() => {
  axiosInstance(`upgrade/assessments/`)
  .then((response) => (
    setAssessmentCard(response.data.results)
  ))
  },[])

  return (
    <div className='upgreade-assessment'>
    <div className="upgrade-container">
      {packages.sort((a, b) => a.id - b.id).map((pkg) => (
        <div key={pkg.id} className={`card-pkg ${pkg.name}`}>
          <div className='tit-btn'>
            <h2 className="card-title">{pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1)}</h2>
            
            {/* Show cost only if it's not Gold package */}
            {pkg.name.toLowerCase() !== 'gold' && (
              <>
                <p className="card-cost">
                  Cost Per Year: Rs. {pkg.cost + (assessmentCosts[pkg.id]?.cost || 0)}
                </p>

                {/* Dropdown for selecting assessment - Only show for non-Gold packages */}
                <select
                  id="purchase"
                  onChange={(e) => handleAssessmentChange(pkg.id, e.target.value)}
                  value={assessmentCosts[pkg.id]?.id || ""}
                >
                  <option value="">Select MCQ Assessment</option>
                  {assessmentNames.map((assessment) => (
                    <option key={assessment.id} value={assessment.id}>
                      {assessment.name}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* Get Started Button */}
            <button 
              className='pkg-btn'
              onClick={() => handleGetStartedClick(pkg)}
              disabled={pkg.name.toLowerCase() !== 'gold' && !assessmentCosts[pkg.id]?.id} // Disable only if not Gold and no assessment selected
            >
              Get Started
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show error message */}
          </div>
          <div className="card-description-pkg">
            {pkg.description.split('\r\n').map((line, index) => (
              <div key={index} className="description-line">
                <FaCheck className="check-icon" /> <p>{line}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Modal isOpen={showContact} onClose={() => setShowContact(false)}>
        {selectedPackage && <Contact packageDetails={selectedPackage} onClose={() => setShowContact(false)} />}
      </Modal>
      </div>


{/* Assessment Card call here */}
<div className='org-card-assessmemt'>
  <p className='assment-header-upgrade'>Assessment Packages</p>
  {assessmentCard
    .filter((item) => item.cost > 1) // Filter out items with cost > 1
    .map((item) => (
      <div key={item.id} className='assessment-card-upgrade'> {/* Separate card for each assessment */}
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p style={{fontWeight: '600'}}>Cost Per Year: Rs. {item.cost}</p>
      </div> 
    ))}
</div>

    </div>
  );  
};

export default Upgrade;
