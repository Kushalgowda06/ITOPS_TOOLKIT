import { useState } from "react";
import IacServiceCards from "./IacServiceCards";

export default function LandingIACHeader(){
  const [selectedMenu, setSelectedMenu] = useState("Compute");

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="bg-white m-2 h-100">
      {/* <nav className="nav_iac shadow-sm p-3 mb-5 bg-white rounded">
        {["Compute", "Database", "Storage"].map((menu, idx) => (
          <a
            key={idx}
            className={`nav-link_iac ${selectedMenu === menu ? "active" : ""}`}
            onClick={() => handleMenuClick(menu)}
            href="#"
          >
            {menu}
          </a>
        ))}
      </nav> */}
        <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 className="text-center chatbot-title heading flex-grow-1">
                AI Powered Build Automation
              </h1>
              <button type="submit" className="btn  mt-4 btn-outline-primary btn-width font-weight-bold">Create Git Repo</button>
            </div>
      {selectedMenu && (
        <div className="mt-4">
          <IacServiceCards />
        </div>
      )}
    </div>
  );
}