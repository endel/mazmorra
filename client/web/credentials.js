var EventEmitter = require('tiny-emitter')

class Credentials extends EventEmitter {

  constructor() {
    super()
    this.token = localStorage.getItem('token')

    this.on('login', () => {
      this.credentials.classList.remove('active')
    })
  }

  init () {
    fetch(`${ config.BACKEND_ENDPOINT }/auth?token=${ this.token }`).then((response) => {
      return response.json()
    }).then((data) => {
      console.log("INIT:", data);
      this.onAuth(data);
    })
  }

  update (properties) {
    return fetch(`${ config.BACKEND_ENDPOINT }/hero?token=${ this.token }`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(properties)
    })
  }

  onAuth (data) {
    this.credentials = document.querySelector('#credentials')

    this.registerForm = this.credentials.querySelector('form')
    this.registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.onSubmitCredentials(e);
    });

    this.message = this.registerForm.querySelector('.message')
    this.action = "login"

    Array.from(this.registerForm.querySelectorAll('input[type=submit]')).forEach(inputSubmit => {
      inputSubmit.addEventListener("click", () => this.registerForm.dispatchEvent(new Event("submit")));
    });

    this.registerForm.querySelector('p.visible-register a').addEventListener('click', (e) => {
      e.preventDefault()
      this.registerForm.classList.remove('register')
      this.registerForm.classList.add('login')
      this.action = "login"
    })

    this.registerForm.querySelector('p.visible-login a').addEventListener('click', (e) => {
      e.preventDefault()
      this.action = "register"
      this.registerForm.classList.add('register')
      this.registerForm.classList.remove('login')
    })

    if (!data.valid) {
      this.credentials.classList.add('active')

    } else {
      this.emit('login', data)
    }
  }

  onSubmitCredentials (e) {
    console.log("ON SUBMIT!");
    console.log(`${config.BACKEND_ENDPOINT}/auth/${this.action}`);

    e.preventDefault()

    fetch(`${config.BACKEND_ENDPOINT}/auth/${this.action}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.registerForm.querySelector('input[type=email]').value,
        password: this.registerForm.querySelector('input[type=password]').value
      })
    }).
    then(this.checkStatus.bind(this)).
    then(r => r.json()).
    then(this.onSuccess.bind(this)).
    catch(this.onError.bind(this))
  }

  onSuccess (data) {
    this.token = data.token

    localStorage.setItem("token", this.token)

    this.emit('login', data)
  }

  onError (data) {
    this.message.innerHTML = (this.action === "register") ? "Email address already in use or password invalid" : "Email or password invalid."
  }

  checkStatus (response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }


}

export default new Credentials
