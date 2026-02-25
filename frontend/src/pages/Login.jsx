import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import '../styles/Login.css';


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("login/", {
        username: username,
        password: password,
      });

      // Save tokens
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      alert("Login Successful!");
      navigate("/home");

    } catch (error) {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;