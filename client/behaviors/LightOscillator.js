import { Behaviour } from 'behaviour.js'

import lerp from 'lerp'

export default class LightOscillator extends Behaviour {

  onAttach (min, max, lerpRatio = 0.2) {
    this.min = min
    this.max = max

    this.distance = this.object.distance
    this.decay = 1
    this.lerpRatio = lerpRatio

    this.oscillateInterval = setInterval(this.oscillate.bind(this), 100)
    this.oscillate()
  }

  oscillate () {
    this.targetIntensity = this.min + (Math.random() * (this.max - this.min))
    this.targetDistance = this.distance + this.distance * (Math.random() * (this.max - this.min))
    this.targetDecay = this.decay - (Math.random() * (this.max - this.min))
  }

  update () {
    this.object.intensity = lerp(this.object.intensity, this.targetIntensity, this.lerpRatio)
    this.object.distance = lerp(this.object.distance, this.targetDistance, this.lerpRatio)
    this.object.decay = lerp(this.object.decay, this.targetDecay, this.lerpRatio)
  }

  onDetach () {
    console.log("DETACH LIGHT OSCILLATOR");
    clearInterval(this.oscillateInterval)
  }

}
