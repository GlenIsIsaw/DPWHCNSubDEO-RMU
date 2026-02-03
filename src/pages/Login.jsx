import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, initUsers, getCurrentUser } from "../db/userService";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    initUsers(); // initialize users if not exists
    const session = getCurrentUser();
    if (session) navigate("/"); // already logged in
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = login(username, password);
    if (user) {
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #0B3D91, #1CA3EC)",
      }}
    >
      <Card
        style={{
          width: "400px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          padding: "30px",
        }}
      >
        <div className="text-center mb-3">
          <img
            src="/DPWH.png" // path to your logo
            alt="DPWH Logo"
            style={{ width: "80px", height: "auto" }}
          />
        </div>
        <h5
          className="text-center mb-4 login-title"
          style={{ color: "#0B3D91", fontWeight: "700", letterSpacing: "1px" }}
        >
          Records Management Unit <br />
          <span
            className="text-center mb-4 login-title"
            style={{
              color: "#FF5F15",
              fontSize: "1rem",
              letterSpacing: "0.3px",
            }}
          >
            DPWH CN Sub - DEO
          </span>
        </h5>

        {error && (
          <p
            className="text-center"
            style={{
              color: "#e74c3c",
              fontWeight: "500",
              marginBottom: "15px",
            }}
          >
            {error}
          </p>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: "500" }}>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                borderRadius: "10px",
                padding: "10px",
                border: "1px solid #ced4da",
                transition: "0.3s",
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: "500" }}>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: "10px",
                padding: "10px",
                border: "1px solid #ced4da",
                transition: "0.3s",
              }}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            style={{
              backgroundColor: "#0B3D91",
              border: "none",
              padding: "10px 0",
              fontWeight: "600",
              fontSize: "1rem",
              borderRadius: "10px",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow = "0 0 15px #1CA3EC")
            }
            onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
