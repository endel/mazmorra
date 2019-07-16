import { client } from '../core/network';
import Composition from '../elements/character/Composition';
import { PlayerPrefs } from '../core/PlayerPrefs';

var EventEmitter = require('tiny-emitter')

class Login extends EventEmitter {

  constructor() {
    super()

    this.credentials = document.querySelector('#credentials')
    this.fbLoginButtons = Array.from(this.credentials.querySelectorAll("a.fb-login"));

    this.body = document.querySelector("body");

    // allow to press enter to submit form
    this.credentials.querySelector("section.register input").addEventListener("keypress", (e) => {
      if (e.which === 13) {
        e.preventDefault();
        this.credentials.querySelector("a.register").dispatchEvent(new Event("click"));
      }
    });

    this.credentials.querySelector("a.register").addEventListener("click", (e) => {
      e.preventDefault();
      this.emit('register', {
        name: this.credentials.querySelector("section.register input").value || "Anonymous"
      });
    });

    this.on('register', () => this.hideLogin());
    this.on('login', () => this.hideLogin());
  }

  showFacebookButtons() {
    this.fbLoginButtons.forEach(fbLogin => {
      fbLogin.classList.remove("hidden");

      fbLogin.addEventListener("click", (e) => {
        e.preventDefault();
        this.showLoading();

        FB.login((response) => {
          if (response.authResponse) {
            client.auth.login({ accessToken: response.authResponse.accessToken }).then((response) => {
              this.hideFacebookButtons();
              this.showHeroes();
            }).catch().then(() => {
              this.hideLoading();
            });

          } else {
            this.hideLoading();
          }
        }, { scope: 'public_profile,email' }); // ,user_friends
      });
    });
  }

  showLoading() {
    this.body.classList.add("loading");
  }

  hideLoading() {
    this.body.classList.remove("loading");
  }

  hideFacebookButtons() {
    this.fbLoginButtons.forEach(fbLogin => fbLogin.classList.add('hidden'));
  }

  hideLogin() {
    if (this.credentials.parentNode) {
      this.credentials.parentNode.removeChild(this.credentials);
    }
  }

  async init () {
    // console.log(this.credentials);
    await this.login();
  }

  async login() {
    try {
      const user = await client.auth.login();

      if (!user.facebookId) {
        this.showFacebookButtons();
      }

    } catch (e) {
      // display "server offline" message
      document.querySelector(".not-loaded").innerHTML = "Server is offline.";
      document.body.classList.remove("loaded");
      return;
    }

    this.showHeroes();
  }

  async showHeroes (heroes) {
    if (!heroes) {
      heroes = await this.getHeroes();
    }

    if (heroes.length === 0) {
      this.showRegister();

    } else {
      this.hideRegister();

      const heroTemplate = this.credentials.querySelector("#hero-template").innerHTML;
      const scale = 5;

      this.credentials.querySelector("ul.heroes").innerHTML = heroes.map((hero, i) => {
        const composition = new Composition(hero);
        const map = composition.sprite.material.map;
        const image = map.image;
        return heroTemplate.
          replace(/\{index\}/ig, i).
          replace("{name}", `${hero.name}`).
          replace("{lvl}", `Level ${hero.lvl}`).
          replace("{background-image}", image.src).
          replace("{background-position}",  `-${(map.frame.x * scale)}px -${map.frame.y * scale}px`);
      }).join("");

      const loginSection = this.credentials.querySelector("section.login.hidden");
      if (loginSection) {
        loginSection.classList.remove("hidden");
      }

      Array.from(this.credentials.querySelectorAll("section.login ul a")).forEach(heroLink => {
        heroLink.addEventListener("click", (e) => {
          e.preventDefault();

          const dataset = e.currentTarget.dataset;
          if (dataset.index !== undefined) {
            PlayerPrefs.set("heroId", heroes[dataset.index]._id);
            this.emit('login');

          } else if (dataset.remove) {
            const hero = heroes[dataset.remove]
            if (confirm(`Are you sure to permanently remove "${hero.name} - Level ${hero.lvl}"`)) {
              this.showLoading();
              this.deleteHero(hero).then((heroes) => {
                this.showHeroes(heroes);
                this.hideLoading();
              });
            }
          }
        });
      });

      this.credentials.querySelector("a.new-hero").addEventListener("click", (e) => {
        e.preventDefault();

        if (document.querySelectorAll("ul.heroes li").length >= 3) {
          alert("You can only have 3 active heroes.");

        } else {
          this.showRegister();
        }
      });
    }

  }

  showRegister () {
    const hiddenRegisterSection = this.credentials.querySelector("section.register.hidden");
    if (hiddenRegisterSection) {
      hiddenRegisterSection.classList.remove("hidden");
    }

    this.credentials.querySelector("section.login").classList.add("hidden");
  }

  hideRegister() {
    this.credentials.querySelector("section.register").classList.add("hidden");
  }

  async getHeroes() {
    return fetch(`${ client.auth.endpoint }/hero`, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + client.auth.token
      },
    }).then(r => r.json());
  }

  async createHero(data) {
    return fetch(`${client.auth.endpoint}/hero`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + client.auth.token
      },
    }).then(r => r.json());
  }

  async deleteHero(data) {
    return fetch(`${client.auth.endpoint}/hero`, {
      method: 'delete',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + client.auth.token
      },
    }).then(r => r.json());
  }

  async update (properties) {
    await client.auth.save();
  }

}

export default new Login
