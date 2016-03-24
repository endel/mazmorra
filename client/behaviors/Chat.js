import { Behaviour } from 'behaviour.js'
import Keycode from 'keycode.js'

export default class Chat extends Behaviour {

  onAttach (room) {
    this.room = room

    this.modal = document.querySelector('.speak-modal')
    this.form = this.modal.querySelector('form')
    this.input = this.form.querySelector('input')

    this.lastMessage = null

    this.onSubmitCallback = this.onSubmit.bind(this)
    this.onKeyUpCallback = this.onKeyUp.bind(this)

    this.form.addEventListener('submit', this.onSubmitCallback)
    document.addEventListener('keyup', this.onKeyUpCallback)
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
      this.room.send(['msg', message])
      setTimeout(() => this.input.value = "", 500)
    }
  }

  onDetach () {
    this.form.removeEventListener('submit', this.onSubmitCallback)
    document.removeEventListener('keyup', this.onKeyUpCallback)
  }

}
