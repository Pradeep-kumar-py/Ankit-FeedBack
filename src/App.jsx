import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser';
import { emailConfig } from './emailConfig';


function App() {

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  console.log('Service ID:', serviceId);
  const form = useRef();
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    location: '',
    issueType: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    submitted: false,
    loading: false,
    error: null
  });
  const [submittedData, setSubmittedData] = useState(null);

  const issueTypes = ['Slow Internet', 'No Connectivity', 'Login Issues', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Check for empty fields
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (validateForm()) {
  //     // Form is valid, process submission
  //     setStatus({ submitted: false, loading: true, error: null });
  //     setSubmittedData({...formData});

  //     // Send email using EmailJS
  //     emailjs.sendForm(
  //       serviceId, // Replace with your EmailJS service ID
  //       templateId, // Replace with your EmailJS template ID
  //       form.current,
  //       publicKey // Replace with your EmailJS public key
  //     )
  //     .then((result) => {
  //       console.log('Email sent successfully:', result.text);
  //       setStatus({ submitted: true, loading: false, error: null });

  //       // Reset form after submission
  //       setFormData({
  //         fullName: '',
  //         idNumber: '',
  //         location: '',
  //         issueType: '',
  //         description: ''
  //       });

  //       // Reset submission status after 5 seconds
  //       setTimeout(() => {
  //         setStatus(prev => ({ ...prev, submitted: false }));
  //       }, 5000);
  //     })
  //     .catch((error) => {
  //       console.error('Email sending failed:', error);
  //       setStatus({ submitted: false, loading: false, error: 'Failed to submit your complaint. Please try again.' });
  //     });
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Form is valid, process submission
      setStatus({ submitted: false, loading: true, error: null });
      setSubmittedData({ ...formData });

      // Create template parameters that match your EmailJS template
      const templateParams = {
        name: formData.fullName,
        rollNumber: formData.idNumber,
        room: formData.location,
        issueType: formData.issueType,
        message: formData.description,
        time: new Date().toLocaleString(),
      };

      // Send email using EmailJS
      emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      )
        .then((result) => {
          console.log('Email sent successfully:', result.text);
          setStatus({ submitted: true, loading: false, error: null });

          // Reset form after submission
          setFormData({
            fullName: '',
            idNumber: '',
            location: '',
            issueType: '',
            description: ''
          });

          // Rest of your code...
        })
        .catch((error) => {
          // Error handling...
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 py-4">
          <h1 className="text-white text-center text-2xl font-bold">WiFi Complaint Form</h1>
        </div>

        {status.submitted && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative my-4 mx-4" role="alert">
            <strong className="font-bold">Success! </strong>
            <span className="block sm:inline">Your complaint has been submitted successfully.</span>
          </div>
        )}

        {status.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 mx-4" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{status.error}</span>
          </div>
        )}

        <form ref={form} onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="idNumber">
              Roll Number or Employee ID
            </label>
            <input
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.idNumber ? 'border-red-500' : 'border-gray-300'}`}
              id="idNumber"
              name="idNumber"
              type="text"
              placeholder="Enter your roll number or employee ID"
              value={formData.idNumber}
              onChange={handleChange}
            />
            {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="location">
              Room Number or Location
            </label>
            <input
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
              id="location"
              name="location"
              type="text"
              placeholder="Enter your room number or location"
              value={formData.location}
              onChange={handleChange}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="issueType">
              Type of Issue
            </label>
            <select
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.issueType ? 'border-red-500' : 'border-gray-300'}`}
              id="issueType"
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
            >
              <option value="">Select an issue type</option>
              {issueTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
            {errors.issueType && <p className="text-red-500 text-xs mt-1">{errors.issueType}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              id="description"
              name="description"
              rows="4"
              placeholder="Describe your issue in detail"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto transition duration-150 ease-in-out flex items-center justify-center"
              type="submit"
              disabled={status.loading}
            >
              {status.loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>

      {/* Display submitted data section */}
      {submittedData && status.submitted && (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-8">
          <div className="bg-gray-700 py-4">
            <h2 className="text-white text-center text-xl font-bold">Submitted Data</h2>
          </div>
          <div className="px-6 py-4">
            <div className="mb-2"><strong>Full Name:</strong> {submittedData.fullName}</div>
            <div className="mb-2"><strong>Roll Number/Employee ID:</strong> {submittedData.idNumber}</div>
            <div className="mb-2"><strong>Room Number/Location:</strong> {submittedData.location}</div>
            <div className="mb-2"><strong>Issue Type:</strong> {submittedData.issueType}</div>
            <div className="mb-2"><strong>Description:</strong> {submittedData.description}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
