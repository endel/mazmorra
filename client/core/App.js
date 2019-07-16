import Tweener from "tweener";
import Clock from "clock-timer.js";
import { createComponentSystem } from "behaviour.js";
import { isMobile } from "../utils/device";

// const Tweener = require("tweener");
// const Clock = require("clock-timer.js").default;
// const createComponentSystem = require("behaviour.js").createComponentSystem;
// const isMobile = require("../utils/device").isMobile;

class App {

  constructor () {
    this.tweens = new Tweener()
    this.clock = new Clock()
    this.componentSystem = createComponentSystem(THREE.Object3D)
    this.mouse = new THREE.Vector2();

    if (isMobile) {
      // window.addEventListener('touchstart', this.onMouseMove.bind(this), false);

    } else {
      window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    }
  }

  update () {
    this.clock.tick()
    this.tweens.update(this.clock.deltaTime)
    this.componentSystem.update()
  }


  onMouseMove (e) {
    this.mouse.clientX = e.clientX;
    this.mouse.clientY = e.clientY;

    this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1
    this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1
  }

}

export default new App();
// module.exports = new App();
