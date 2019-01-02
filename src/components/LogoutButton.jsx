import React from "react";
import AuthService from "../middleware/AuthService";

function Logout(props) {
  const Auth = new AuthService();

  const handleLogout = () => {
    Auth.logout();
    props.history.replace("/login");
  };

  return (
    <button type="button" className="form-submit" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
