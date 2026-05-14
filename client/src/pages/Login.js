import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";
import { apiUrl } from "../config/apiBase";

const Login = ({ setUsername, setAdminUsername, role = "user" }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [step, setStep] = useState(1);

  const apiEndpoints = {
    initiateLogin:
      role === "admin"
        ? apiUrl("/admin/initiate-login")
        : apiUrl("/api/auth/initiate-login"),

    verifyLogin:
      role === "admin"
        ? apiUrl("/admin/verify-login")
        : apiUrl("/api/auth/verify-login"),

    resendOtp:
      role === "admin"
        ? apiUrl("/admin/resend-otp")
        : apiUrl("/api/auth/resend-otp"),
  };

  const redirectPath =
    role === "admin" ? "/admin" : "/dashboard";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // STEP 1 -> SEND OTP
  const initiateLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        apiEndpoints.initiateLogin,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
            password: "login",
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Login Initiation Response:",
        data
      );

      if (response.ok) {
        setStep(2);

        setMessage(
          data.message ||
            "OTP sent successfully"
        );
      } else {
        setMessage(
          data.message ||
            "Login failed"
        );
      }
    } catch (error) {
      console.log(
        "Login Initiation Error:",
        error
      );

      setMessage(
        "Server error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2 -> VERIFY OTP

  const verifyOtp = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        apiEndpoints.verifyLogin,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
            otp,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "OTP Verification:",
        data
      );

      if (response.ok) {
        const tokenKey =
          role === "admin"
            ? "adminToken"
            : "token";

        const usernameKey =
          role === "admin"
            ? "adminUsername"
            : "username";

        localStorage.setItem(
          tokenKey,
          data.token
        );

        localStorage.setItem(
          usernameKey,
          data.username
        );

        localStorage.setItem(
          "role",
          data.role
        );

        if (role === "admin") {
          setAdminUsername(data.username);
        } else {
          setUsername(data.username);
        }

        setMessage(
          "Login successful!"
        );

        // Removed delay
        navigate(redirectPath);
      } else {
        setMessage(
          data.message ||
            "OTP verification failed"
        );
      }
    } catch (error) {
      console.log(
        "OTP Verify Error:",
        error
      );

      setMessage(
        "Server error. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // RESEND OTP

  const resendOtp = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        apiEndpoints.resendOtp,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setMessage(
          "OTP resent successfully"
        );
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage(
        "Failed to resend OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showForm && (
        <div className="nh-page-auth">
          <div className="login-form-container">

            <button
              className="close-btn"
              onClick={() =>
                setShowForm(false)
              }
            >
              ×
            </button>

            <h2>
              {role === "admin"
                ? "Admin Login"
                : "User Login"}
            </h2>

            {step === 1 ? (
              <form
                onSubmit={initiateLogin}
                className="login-form"
              >
                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={
                    isLoading
                  }
                >
                  {isLoading
                    ? "Sending OTP..."
                    : "Get OTP"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={
                  verifyOtp
                }
                className="login-form"
              >
                <p className="otp-info">
                  We've sent OTP to
                  <strong>
                    {" "}
                    {
                      formData.email
                    }
                  </strong>
                </p>

                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={
                      handleOtpChange
                    }
                    required
                    maxLength={6}
                  />
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={
                    isLoading
                  }
                >
                  {isLoading
                    ? "Verifying..."
                    : "Verify & Login"}
                </button>

                <div className="otp-actions">
                  <button
                    type="button"
                    onClick={
                      resendOtp
                    }
                  >
                    Resend OTP
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStep(1)
                    }
                  >
                    Change Email
                  </button>
                </div>
              </form>
            )}

            {message && (
              <p>{message}</p>
            )}

            {step === 1 && (
              <p>
                Don't have an
                account?{" "}
                <Link to="/register">
                  Sign Up
                </Link>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Login;