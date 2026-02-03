import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { logout } from "../../db/userService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmActionModal from "../records/ConfirmActionModal"; // adjust path if needed

function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="shadow-sm py-2"
        style={{
          backgroundColor: "#FF5F15", // DPWH Blue
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container fluid className="px-3 d-flex align-items-center">
          {/* Hamburger menu for mobile */}
          <Button
            variant="light"
            className="d-lg-none me-3 rounded-circle p-2"
            onClick={onMenuClick}
            style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.15)" }}
          >
            <i
              className="bi bi-list"
              style={{ color: "#0057B7", fontSize: "1.2rem" }}
            ></i>
          </Button>

          {/* Brand */}
          <Navbar.Brand
            className="fw-bold d-flex align-items-center"
            style={{ color: "white", fontSize: "1.15rem" }}
          >
            <i
              className="bi bi-folder-check me-2"
              style={{ fontSize: "1.3rem" }}
            ></i>
            Records Management Unit
          </Navbar.Brand>

          {/* Right side navigation */}
          <Nav className="ms-auto d-flex align-items-center gap-2">
            <Nav.Link
              className="text-white d-flex align-items-center"
              style={{ fontWeight: 500 }}
            >
              <i className="bi bi-person-circle me-1"></i>
              Admin
            </Nav.Link>
            <Nav.Link
              className="text-white d-flex align-items-center"
              style={{ fontWeight: 500 }}
              onClick={() => setShowLogoutModal(true)}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Logout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <ConfirmActionModal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        variant="danger"
        onConfirm={handleLogout}
      />
    </>
  );
}

export default Topbar;
