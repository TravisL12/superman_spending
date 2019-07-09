// Auth setup using: https://hptechblogs.com/using-json-web-token-react/
import decode from "jwt-decode";

const DOMAIN = "http://0.0.0.0:3131";

class AuthService {
  login = (email, password) => {
    return this.fetch("api/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      })
    }).then(res => {
      this.setToken(res.token);
      return Promise.resolve(res);
    });
  };

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  setToken(idToken) {
    localStorage.setItem("id_token", idToken);
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  logout() {
    localStorage.removeItem("id_token");
  }

  getProfile = () => {
    return decode(this.getToken());
  };

  fetch = (url, options, isMultiPart = false) => {
    const headers = {
      Accept: "application/json"
    };

    if (!isMultiPart) {
      headers["Content-Type"] = "application/json";
    }

    if (this.loggedIn()) {
      headers["Authorization"] = this.getToken();
    }

    return fetch(`${DOMAIN}/${url}`, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json())
      .catch(error => console.log(error));
  };

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}

export default new AuthService();
