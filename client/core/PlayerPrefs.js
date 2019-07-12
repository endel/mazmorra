const PREFIX = "$unixie$"

export class PlayerPrefs  {

    static set (key, value) {
        if (typeof(key)==="string") {
            // set a single value
            localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));

        } else if (typeof(key)==="object" && typeof(value)==="undefined") {
            // set multiple values
            for (let k in key) {
                this.set(k, key[k]);
            }
        }
    }

    static get (key) {
        return JSON.parse(localStorage.getItem(`${PREFIX}${key}`));
    }

    static remove (key) {
        localStorage.removeItem(`${PREFIX}${key}`);
    }

    static clear () {
        localStorage.clear();
    }

}
