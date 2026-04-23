export class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl.replace(/\/$/, "");
    this._headers = { ...headers };
  }

  _checkResponse(res) {
    if (res.ok) {
      if (res.status === 204) {
        return Promise.resolve();
      }
      return res.json();
    }
    return Promise.reject(new Error(`Ошибка: ${res.status}`));
  }

  _request(endpoint, options = {}) {
    const config = {
      ...options,
      headers: { ...this._headers, ...options.headers },
    };
    return fetch(`${this._baseUrl}${endpoint}`, config).then((res) =>
      this._checkResponse(res)
    );
  }

  getUserInfo() {
    return this._request("/users/me");
  }

  getInitialCards() {
    return this._request("/cards");
  }

  editProfile({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  editAvatar(avatar) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
    });
  }

  addCard({ name, link }) {
    return this._request("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    });
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, { method: "DELETE" });
  }

  /**
   * @param {string} cardId
   * @param {boolean} like — поставить ли лайк (true = PUT, false = DELETE)
   */
  changeLikeCardStatus(cardId, like) {
    return this._request(`/cards/${cardId}/likes`, {
      method: like ? "PUT" : "DELETE",
    });
  }
}
