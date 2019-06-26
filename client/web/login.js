import { client } from '../core/network';

var EventEmitter = require('tiny-emitter')

class Login extends EventEmitter {

  constructor() {
    super()
    this.credentials = document.querySelector('#credentials')

    this.on('register', () => this.hideLogin());
    this.on('login', () => this.hideLogin());
  }

  hideLogin() {
    this.credentials = document.querySelector('#credentials')
    this.credentials.parentNode.removeChild(this.credentials);
    // this.credentials.classList.remove('active')
  }

  async init () {
    // console.log(this.credentials);
    await this.login();
  }

  async login() {
    await client.auth.login();

    const heroes = await this.getHeroes();

    if (heroes.length === 0) {
      this.showRegister();

    } else {
      this.credentials.querySelector("p.login.hidden").classList.remove("hidden");
      this.credentials.querySelector("a.login").addEventListener("click", (e) => {
        e.preventDefault();
        this.emit('login', heroes[0]);
      });

      this.credentials.querySelector("a.new-hero").addEventListener("click", (e) => {
        e.preventDefault();

        if (confirm("Your progress with current hero will be lost, would you like to proceed?")) {
          this.showRegister();
        }
      });
    }
  }

  showRegister () {
    this.credentials.querySelector("p.login").classList.add("hidden");

    // allow to press enter to submit form
    this.credentials.querySelector("div.register input").addEventListener("keypress", (e) => {
      if (e.which === 13) {
        e.preventDefault();
        this.credentials.querySelector("a.register").dispatchEvent(new Event("click"));
      }
    });

    this.credentials.querySelector("div.register.hidden").classList.remove("hidden");
    this.credentials.querySelector("a.register").addEventListener("click", (e) => {
      e.preventDefault();
      this.emit('register', {
        name: this.credentials.querySelector("div.register input").value || "Anonymous"
      });
    });
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

  async update (properties) {
    await client.auth.save();
  }

}

export default new Login
