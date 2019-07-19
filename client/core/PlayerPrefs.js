const localStorage = window.localStorage || {
  //
  // some browser configurations may block `localStorage` usage from an iframe
  // e.g.: "Failed to read the 'localStorage' property from 'Window': Access is denied for this document."
  //
  _data: {},
  setItem(k, v) { this._data[k] = v },
  getItem(k) { return this._data[k] },
  removeItem(k) { delete this._data[k] },
  clear() { this._data = {}; }
}

export class PlayerPrefs  {

  static set (key, value) {
    localStorage.setItem(key, value);
  }

  static get (key) {
    return localStorage.getItem(key);
  }

  static getNumber (key, fallback = "0") {
    return parseInt(localStorage.getItem(key) || fallback);
  }

  static remove (key) {
    localStorage.removeItem(key);
  }

  static clear () {
    localStorage.clear();
  }

  static hasSeenBoss(entity, bool) {
    if (bool) {
      return localStorage.setItem(`boss-${entity.kind}-seen`, bool);

    } else {
      return localStorage.getItem(`boss-${entity.kind}-seen`);
    }
  }

  static hasKilledBoss(entity, bool) {
    if (bool) {
      return localStorage.setItem(`boss-${entity.kind}-killed`, bool);

    } else {
      return localStorage.getItem(`boss-${entity.kind}-killed`);
    }
  }

}
