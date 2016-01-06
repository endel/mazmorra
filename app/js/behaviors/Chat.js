import { Behaviour } from 'behaviour.js'
import Keycode from 'keycode.js'

export default class CharacterController extends Behaviour {

  onAttach () {
    this.modal = document.querySelector('.speak-modal')
    this.form = this.modal.querySelector('form')
    this.input = this.form.querySelector('input')

    this.lastMessage = null

    this.form.addEventListener('submit', this.onSubmit.bind(this))
    document.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  onKeyUp (e) {
    if (e.which === Keycode.ENTER) {
      this.modal.classList.toggle('active')

      if (this.modal.classList.contains('active')) {
        this.modal.querySelector('input').focus()
      }
    }
  }

  onSubmit (e) {
    e.preventDefault()
    var message = this.input.value
    if (message !== "" && message !== this.lastMessage) {
      this.lastMessage = message
      this.entity.emit('chat', message)
      setTimeout(() => this.input.value = "", 500)
    }
  }

  onDetach () {
    // if (this.tween) this.tween.dispose()
  }

}
