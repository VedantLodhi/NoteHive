import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Login.css';

const Login = ({ setUsername, setAdminUsername, role = 'user' }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true); // State to control form visibility
  const [step, setStep] = useState(1); // Step 1: Email input, Step 2: OTP verification

  // Determine API endpoints based on role
  const baseUrl = 'http://localhost:5000';
  const apiEndpoints = {
    initiateLogin: role === 'admin' ? `${baseUrl}/admin/initiate-login` : `${baseUrl}/api/auth/initiate-login`,
    verifyLogin: role === 'admin' ? `${baseUrl}/admin/verify-login` : `${baseUrl}/api/auth/verify-login`,
    resendOtp: role === 'admin' ? `${baseUrl}/admin/resend-otp` : `${baseUrl}/api/auth/resend-otp`,
    login: role === 'admin' ? `${baseUrl}/admin/login` : `${baseUrl}/api/auth/login` // Legacy endpoint
  };
  
  const redirectPath = role === 'admin' ? '/admin' : '/dashboard'; // Redirect users to dashboard after login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Step 1: Initiate login and request OTP
  const initiateLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(apiEndpoints.initiateLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      console.log("Login Initiation Response:", data);

      if (response.ok) {
        setStep(2); // Move to OTP verification step
        setMessage('OTP sent to your email. Please check and enter below.');
      } else {
        setMessage(data.message || 'Login initiation failed. Try again.');
      }
    } catch (error) {
      console.error("Login Initiation Error:", error);
      setMessage('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and complete login
  const verifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(apiEndpoints.verifyLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          otp,
          password: formData.password // Optional, depending on your backend implementation
        }),
      });

      const data = await response.json();
      console.log("OTP Verification Response:", data);

      if (response.ok) {
        const storageKey = role === 'admin' ? 'adminToken' : 'token';
        const usernameKey = role === 'admin' ? 'adminUsername' : 'username';

        localStorage.setItem(storageKey, data.token);
        localStorage.setItem(usernameKey, data.username);
        localStorage.setItem('role', data.role); // Store role in localStorage

        if (role === 'admin') {
          setAdminUsername(data.username);
        } else {
          setUsername(data.username);
        }

        setMessage(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful! Redirecting...`);

        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);
      } else {
        setMessage(data.message || 'OTP verification failed. Try again.');
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setMessage('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Request OTP resend
  const resendOtp = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(apiEndpoints.resendOtp, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, purpose: 'login' }),
      });

      const data = await response.json();
      console.log("Resend OTP Response:", data);

      if (response.ok) {
        setMessage('OTP resent to your email. Please check and enter below.');
      } else {
        setMessage(data.message || 'Failed to resend OTP. Try again.');
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setMessage('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to step 1
  const handleBack = () => {
    setStep(1);
    setMessage('');
  };

  return (
    <>
      {showForm && (
        <div className="login-form-container">
          <button className="close-btn" onClick={() => setShowForm(false)}>
            &times; {/* Cross symbol for close */}
          </button>
          <h2>{role === 'admin' ? 'Admin Login' : 'User Login'}</h2>
          
          {step === 1 ? (
            // Step 1: Email input form
            <form onSubmit={initiateLogin} className="login-form">
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder={`${role === 'admin' ? 'Admin Email' : 'Email'}`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder={`${role === 'admin' ? 'Admin Password' : 'Password'}`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Sending OTP...' : 'Get OTP'}
              </button>
            </form>
          ) : (
            // Step 2: OTP verification form
            <form onSubmit={verifyOtp} className="login-form">
              <p className="otp-info">
                We've sent a verification code to <strong>{formData.email}</strong>
              </p>
              <div className="input-group">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  required
                  maxLength={6}
                  className="otp-input"
                />
              </div>
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <div className="otp-actions">
                <button 
                  type="button" 
                  className="text-btn" 
                  onClick={resendOtp} 
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
                <button 
                  type="button" 
                  className="text-btn" 
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Change Email
                </button>
              </div>
            </form>
          )}
          
          {message && <p className={message.includes('success') || message.includes('sent') ? 'success' : 'error'}>{message}</p>}
          
          {step === 1 && (
            role === 'user' ? (
              <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            ) : (
              <p>Not an admin? <Link to="/login">User Login</Link></p>
            )
          )}
        </div>
      )}
    </>
  );
};

export default Login;
