import { Behaviour } from 'behaviour.js'
import Keycode from 'keycode.js'

import { enterChat } from '../core/network';

export default class Chat extends Behaviour {

  onAttach (level) {
    this.level = level;
    this.maxMessages = 40;

    this.room = enterChat();
    this.room.onMessage.add((message) => this.addMessage(message))
    this.room.onLeave.add(() => {
      if (confirm("The server has been restarted, refresh the game? Please join the Discord Server if you think this is a bug.")) {
        window.location.reload();
      }
    })

    this.isActive = false;

    this.chat = document.querySelector('section#chat')
    this.messagesContainer = this.chat.querySelector('.messages');
    this.messages = this.messagesContainer.querySelector('.contents');
    this.form = this.chat.querySelector('form')
    this.button = this.form.querySelector('button')
    this.input = this.form.querySelector('input')

    this.chat.classList.remove("hidden");

    this.lastMessage = null

    this.onSubmitCallback = this.onSubmit.bind(this)
    this.onKeyUpCallback = this.onKeyUp.bind(this)

    this.form.addEventListener('submit', this.onSubmitCallback)
    document.addEventListener('keyup', this.onKeyUpCallback)
    this.input.addEventListener("keydown", (e) => this.onKeyDown(e));

    this.input.addEventListener("focus", (e) => this.activate());
    this.input.addEventListener("blur", (e) => this.deactivate());

    this.input.addEventListener("click", (e) => this.stopPropagation(e));
    this.button.addEventListener("click", (e) => this.stopPropagation(e));

  }

  onKeyUp (e) {
    if (e.which === Keycode.ENTER) {
      this.input.focus();
    }
  }

  onKeyDown(e) {
    // e.preventDefault();
    e.stopPropagation();

    if (e.which === Keycode.ENTER) {
      this.onSubmit(e);
    }
  }

  activate () {
    this.isActive = true;
    this.chat.classList.add('active')
    this.updateScroll();
  }

  deactivate () {
    this.isActive = true;
    this.chat.classList.remove('active')
    this.updateScroll();
  }

  addMessage (message) {
    if (this.messages.childNodes.length > this.maxMessages) {
      // console.log("remove first messages...");
      this.messages.removeChild(this.messages.childNodes[0]);
    }

    const date = new Date(message.timestamp);
    const child = document.createElement("p");
    child.innerText = `[${date.toLocaleTimeString()}] (${message.progress}) ${message.name} says: ${message.text}`;

    this.messages.appendChild(child);
    this.updateScroll();
  }

  updateScroll() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  onSubmit (e) {
    e.preventDefault()

    var message = this.input.value
    if (message !== "" && message !== this.lastMessage) {
      this.lastMessage = message

      this.room.send(['msg', {
        name: player.userData.name,
        lvl: player.userData.lvl,
        progress: this.level.progress,
        text: message,
      }]);
    }

    this.input.value = "";
  }

  onDetach () {
    this.form.removeEventListener('submit', this.onSubmitCallback)
    document.removeEventListener('keyup', this.onKeyUpCallback)
  }

}
