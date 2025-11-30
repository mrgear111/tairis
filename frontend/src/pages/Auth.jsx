import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Login handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!loginData.email || !loginData.password) {
      setLoginError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("https://tairis-server-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/get-started";
      } else {
        const data = await response.json();
        setLoginError(data.msg || "Invalid email or password");
      }
    } catch (err) {
      setLoginError("An error occurred. Please try again later.");
      console.error(err);
    }
  };

  // Signup handlers
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (!signupData.firstName || !signupData.lastName || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setSignupError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setSignupError("Please enter a valid email address");
      return;
    }

    if (signupData.password.length < 6) {
      setSignupError("Password must be at least 6 characters long");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://tairis-server-production.up.railway.app/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${signupData.firstName} ${signupData.lastName}`,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      if (response.ok) {
        setSignupError("");
        setSignupData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setActiveTab("login");
        setLoginError("Sign up successful! Please log in.");
      } else {
        const data = await response.json();
        setSignupError(data.msg || "Sign up failed. Please try again.");
      }
    } catch (err) {
      setSignupError("An error occurred. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-tabs">
          <button
            className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`tab-btn ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Login Tab */}
        {activeTab === "login" && (
          <div className="tab-content">
            <h2>Login to your account</h2>
            {loginError && <div className="error-message">{loginError}</div>}

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                />
              </div>

              <button type="submit" className="submit-btn">
                Login
              </button>
            </form>

            <div className="form-footer">
              <p>
                <a href="/">Forgot password?</a>
              </p>
            </div>
          </div>
        )}

        {/* Signup Tab */}
        {activeTab === "signup" && (
          <div className="tab-content">
            <h2>Create a new account</h2>
            {signupError && <div className="error-message">{signupError}</div>}

            <form onSubmit={handleSignupSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="signup-firstName">First Name</label>
                  <input
                    type="text"
                    id="signup-firstName"
                    name="firstName"
                    value={signupData.firstName}
                    onChange={handleSignupChange}
                    placeholder="First name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="signup-lastName">Last Name</label>
                  <input
                    type="text"
                    id="signup-lastName"
                    name="lastName"
                    value={signupData.lastName}
                    onChange={handleSignupChange}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-email">Email</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="Enter your password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="signup-confirmPassword"
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  placeholder="Confirm your password"
                />
              </div>

              <button type="submit" className="submit-btn">
                Sign Up
              </button>
            </form>

            <div className="form-footer">
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="tab-switch-btn"
                  onClick={() => setActiveTab("login")}
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        )}

        <div className="auth-footer">
          <p>
            <a href="/">Back to home</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
