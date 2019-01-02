import decode from "jwt-decode";

// Auth setup using: https://hptechblogs.com/using-json-web-token-react/

export default class AuthService {
  constructor(domain) {
    this.domain = domain || "http://0.0.0.0:3000";
    this.fetch = this.fetch.bind(this);
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  login(email, password) {
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
  }

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

  getProfile() {
    return decode(this.getToken());
  }

  fetch(url, options, isMultiPart = false) {
    const headers = {
      Accept: "application/json"
    };

    if (!isMultiPart) {
      headers["Content-Type"] = "application/json";
    }

    if (this.loggedIn()) {
      headers["Authorization"] = this.getToken();
    }

    return fetch(`${this.domain}/${url}`, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json());
  }

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
