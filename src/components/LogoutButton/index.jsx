import React from "react";
import AuthService from "../../middleware/AuthService";
import styles from "../Login/Login.module.scss";

function Logout(props) {
  const handleLogout = () => {
    AuthService.logout();
    props.history.replace("/login");
  };

  return (
    <button type="button" className={styles.formSubmit} onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
