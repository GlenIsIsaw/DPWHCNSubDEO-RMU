import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";

function Sidebar({ show, handleClose }) {
  const sidebarContent = (
    <div
      className="d-flex flex-column h-100 p-3"
      style={{ backgroundColor: "#1B1212" }}
    >
      {" "}
      {/* Dark DPWH blue */}
      <div className="d-flex align-items-center mb-4 justify-content-center">
        <img
          src="/DPWH.png" // <- replace with your logo path
          alt="DPWH Logo"
          style={{
            width: "40px",
            height: "40px",
            objectFit: "contain",
            marginRight: "10px",
          }}
        />
        <h5 className="text-white fw-bold mb-0">CN Sub - DEO</h5>
      </div>
      {/* Navigation Links */}
      <Nav className="flex-column gap-2">
        {["Dashboard", "Records", "Users"].map((item) => (
          <Nav.Link
            key={item}
            className="text-white d-flex align-items-center px-3 py-2 rounded"
            style={{
              transition: "0.2s",
              fontWeight: 500,
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#073B7A")
            } // slightly darker on hover
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <i
              className={`bi bi-${item === "Dashboard" ? "speedometer2" : item === "Records" ? "folder2-open" : "people"} me-2`}
              style={{ fontSize: "1.1rem" }}
            ></i>
            {item}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="d-none d-lg-block"
        style={{
          width: "261px",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 100,
        }}
      >
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        responsive="lg"
        style={{ width: "240px", backgroundColor: "#0B3D91", color: "white" }}
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="text-white">
            DPWH Sub - DEO
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{sidebarContent}</Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
