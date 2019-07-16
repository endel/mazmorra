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

  static remove (key) {
    localStorage.removeItem(key);
  }

  static clear () {
    localStorage.clear();
  }

  static hasSeenBoss(type, bool) {
    if (bool) {
      return localStorage.setItem(`boss-${type}-seen`, bool);

    } else {
      return localStorage.getItem(`boss-${type}-seen`);
    }
  }

  static hasKilledBoss(type, bool) {
    if (bool) {
      return localStorage.setItem(`boss-${type}-killed`, bool);

    } else {
      return localStorage.getItem(`boss-${type}-killed`);
    }
  }

}
