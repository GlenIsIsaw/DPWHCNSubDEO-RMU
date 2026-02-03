import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Navbar";

function MainLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  // Update on window resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: "100vh", overflow: "hidden" }}>
      {/* Sidebar for desktop + offcanvas for mobile */}
      <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />

      {/* Main content */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: isDesktop ? "21px" : 0, // apply sidebar width only on desktop
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Topbar */}
        <Topbar onMenuClick={() => setShowSidebar(true)} />

        {/* Scrollable content */}
        <main
          className="flex-grow-1 overflow-auto p-4"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
