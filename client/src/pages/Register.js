import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Register.css";

const Register = ({ setUsername, setEmail }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Initial form, Step 2: OTP verification

  // Handle input changes and update formData state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Step 1: Initiate registration and request OTP
  const initiateRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/initiate-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Registration Initiation Response:", data);

      if (response.ok) {
        setStep(2); // Move to OTP verification step
        setMessage("OTP sent to your email. Please check and enter below.");
      } else {
        setMessage(data.message || "Registration initiation failed. Try again.");
      }
    } catch (error) {
      console.error("Registration Initiation Error:", error);
      setMessage("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and complete registration
  const verifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();
      console.log("OTP Verification Response:", data);

      if (response.ok) {
        // Clear previous user data from localStorage
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("bio");
        localStorage.removeItem("profilePic");
        localStorage.removeItem("phone");
        localStorage.removeItem("location");

        // Store new user data in localStorage
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", formData.email);

        // Update global state if functions are provided
        if (setUsername) setUsername(data.username);
        if (setEmail) setEmail(formData.email);

        setMessage("Registration successful! Redirecting...");

        setTimeout(() => {
          navigate("/profile");  // Redirect to profile or home page
          // Optionally, remove the following line if you don't want a full page reload.
          window.location.reload();
        }, 1500);
      } else {
        setMessage(data.message || "OTP verification failed. Try again.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setMessage("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Request OTP resend
  const resendOtp = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, purpose: "registration" }),
      });

      const data = await response.json();
      console.log("Resend OTP Response:", data);

      if (response.ok) {
        setMessage("OTP resent to your email. Please check and enter below.");
      } else {
        setMessage(data.message || "Failed to resend OTP. Try again.");
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setMessage("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Close the registration form and navigate to home
  const handleClose = () => {
    navigate("/");
  };

  // Go back to step 1
  const handleBack = () => {
    setStep(1);
    setMessage("");
  };

  return (
    <div className="register-form-container">
      <button className="close-btn" onClick={handleClose}>X</button>
      <h2>Register</h2>
      
      {step === 1 ? (
        // Step 1: Initial registration form
        <form onSubmit={initiateRegistration} className="register-form">
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Sending OTP..." : "Get OTP"}
          </button>
        </form>
      ) : (
        // Step 2: OTP verification form
        <form onSubmit={verifyOtp} className="register-form">
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
            {isLoading ? "Verifying..." : "Verify & Register"}
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
      
      {message && (
        <p className={message.includes("success") || message.includes("sent") ? "success" : "error"}>
          {message}
        </p>
      )}
      
      {step === 1 && (
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      )}
    </div>
  );
};

export default Register;
