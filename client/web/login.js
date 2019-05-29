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
    this.credentials.classList.remove('active')
  }

  async init () {
    // console.log(this.credentials);
    await this.login();
  }

  async login() {
    await client.auth.login();

    const heroes = await this.getHeroes();

    if (heroes.length === 0) {
      this.credentials.querySelector("p.register.hidden").classList.remove("hidden");
      this.credentials.querySelector("a.register").addEventListener("click", (e) => {
        e.preventDefault();
        this.emit('register', {
          name: this.credentials.querySelector("p.register input").value
        });
      });

    } else {
      this.credentials.querySelector("p.login.hidden").classList.remove("hidden");
      this.credentials.querySelector("a.login").addEventListener("click", (e) => {
        e.preventDefault();
        this.emit('login', heroes[0]);
      });
    }
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

  onAuth (data) {
    // this.credentials = document.querySelector('#credentials')

    // this.registerForm = this.credentials.querySelector('form')
    // this.registerForm.addEventListener("submit", (e) => {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   this.onSubmitCredentials(e);
    // });

    // this.message = this.registerForm.querySelector('.message')
    // this.action = "login"

    // Array.from(this.registerForm.querySelectorAll('input[type=submit]')).forEach(inputSubmit => {
    //   inputSubmit.addEventListener("click", () => this.registerForm.dispatchEvent(new Event("submit")));
    // });

    // this.registerForm.querySelector('p.visible-register a').addEventListener('click', (e) => {
    //   e.preventDefault(); e.stopPropagation();
    //   this.registerForm.classList.remove('register')
    //   this.registerForm.classList.add('login')
    //   this.action = "login"
    // })

    // this.registerForm.querySelector('p.visible-login a').addEventListener('click', (e) => {
    //   e.preventDefault(); e.stopPropagation();
    //   this.action = "register"
    //   this.registerForm.classList.add('register')
    //   this.registerForm.classList.remove('login')
    // })

    // if (!data.valid) {
    //   this.credentials.classList.add('active')

    // } else {
    //   this.emit('login', data)
    // }
  }

  onSubmitCredentials (e) {
    // console.log("ON SUBMIT!");
    // console.log(`${client.auth.endpoint}/auth/${this.action}`);

    // fetch(`${client.auth.endpoint}/auth/${this.action}`, {
    //   method: 'post',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     email: this.registerForm.querySelector('input[type=email]').value,
    //     password: this.registerForm.querySelector('input[type=password]').value
    //   })
    // }).
    // then(this.checkStatus.bind(this)).
    // then(r => r.json()).
    // then(this.onSuccess.bind(this)).
    // catch(this.onError.bind(this))
  }

  onSuccess (data) {
    // this.token = data.token

    // localStorage.setItem("token", this.token)

    // this.emit('login', data)
  }

  onError (data) {
    // this.message.innerHTML = (this.action === "register") ? "Email address already in use or password invalid" : "Email or password invalid."
  }

}

export default new Login
