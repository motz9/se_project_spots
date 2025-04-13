class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  _request(url, method, body) {
    const options = {
      method,
      headers: this._headers,
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    return fetch(url, options).then(this._checkResponse);
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()])
  }

  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`)
  }

  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`)
  }

  editUserInfo({ name, about }) {
    return this._request(`${this._baseUrl}/users/me`, "PATCH", {
      name,
      about,
    });
  }

  updateAvatar({ avatar }) {
    return this._request(`${this._baseUrl}/users/me/avatar`, "PATCH", {
      avatar,
    });
  }

  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, "DELETE")
  }

  addNewCard({ name, link }) {
    return this._request(`${this._baseUrl}/cards`, "POST", {
        name,
        link,
      });
  }

  handleLike(cardId, isLiked) {
    const url = `${this._baseUrl}/cards/${cardId}/likes`;
    const method = isLiked ? "DELETE" : "PUT";
    return this._request(url, method);
  }
}

export default Api;
