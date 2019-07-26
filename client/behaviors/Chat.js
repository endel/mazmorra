import { Behaviour } from 'behaviour.js'
import Keycode from 'keycode.js'

import { enterChat } from '../core/network';
import { trackEvent, humanize } from '../utils';

export default class Chat extends Behaviour {

  onAttach (level) {
    this.level = level;
    this.maxMessages = 40;

    this.room = enterChat();
    this.room.onJoin.add(() => {
      // send ping every 30 seconds
      setInterval(() => this.room.send(['ping']), 30 * 1000);
    });

    this.room.onError.add((e) => {
      this.room.removeAllListeners();
    });

    this.room.onMessage.add((message) => this.addMessage(message))
    this.room.onLeave.add(() => {
      if (confirm("The server has been restarted, refresh the game? Please join the Discord Server if you think this is a bug.")) {
        trackEvent('unexpected-disconnect', {
          event_category: 'Unexpected disconnect',
          event_label: 'Disconnect',
        });
        window.location.reload();
      }
    });

    this.isActive = false;
    this.isTyping = false;

    this.chat = document.querySelector('section#chat')
    this.messagesContainer = this.chat.querySelector('.messages');
    this.messages = this.messagesContainer.querySelector('.contents');
    this.form = this.chat.querySelector('form')
    // this.button = this.form.querySelector('button')
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
    // this.button.addEventListener("click", (e) => this.stopPropagation(e));

  }

  onKeyUp (e) {
    if (e.which === Keycode.ENTER) {
      this.input.focus();

    } else if (this.input.value.length > 0) {
      this.startTyping();
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
    this.stopTyping();
  }

  startTyping () {
    if (!this.isTyping) {
      this.level.room.send(['type', true]);
      this.isTyping = true;
    }
  }

  stopTyping () {
    if (this.isTyping) {
      this.level.room.send(['type', false]);
      this.isTyping = false;
    }
  }

  addMessage (message) {
    if (this.messages.childNodes.length > this.maxMessages) {
      // console.log("remove first messages...");
      this.messages.removeChild(this.messages.childNodes[0]);
    }

    const date = new Date(message.timestamp);

    const child = document.createElement("p");

    let text = `[${date.toLocaleTimeString()}] (${message.progress}) ${message.name}`;

    // TODO: Remove .text after beta
    if (message.say || message.text) {
      child.classList.add("say");
      text = `${text} says: ${message.say || message.text}`;

    } else if (message.slain) {
      child.classList.add("slain");
      text = `${text} was slain by ${humanize(message.slain)}`;

    } else if (message.killed) {
      child.classList.add("killed");
      text = `${text} killed the mighty ${humanize(message.killed)}`;
    }

    child.innerText = text;

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
        name: (player && player.userData.name) || "{not connected}",
        lvl: player && player.userData.lvl,
        progress: this.level.progress,
        text: message,
      }]);

      this.level.room.send(['msg', message]);

      this.stopTyping();
    }

    this.input.value = "";
  }

  onDetach () {
    this.form.removeEventListener('submit', this.onSubmitCallback)
    document.removeEventListener('keyup', this.onKeyUpCallback)
  }

}
