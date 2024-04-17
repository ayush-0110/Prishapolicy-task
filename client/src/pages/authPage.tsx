import React, { useState } from "react";
import Register from "../components/register";
import Login from "../components/login";

function AuthPage() {
  const [showRegister, setShowRegister] = useState(false);
  return (
    <div className="mainPage">
      <div className="image">

      <img src="/bg.png" alt="Background" />
      </div>
      <div className="mainbar">
        {showRegister ? (
          <Register onSwitch={() => setShowRegister(false)} />
        ) : (
          <Login onSwitch={() => setShowRegister(true)} />
        )}
      </div>
    </div>
  );
}

export default AuthPage;
