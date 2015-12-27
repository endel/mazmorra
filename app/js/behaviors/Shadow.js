'use strict';
import { Behaviour } from 'behaviour.js'

var material = null, geometry = null

export default class Shadow extends Behaviour {

  onAttach () {
    if (!material) {
      material = new THREE.MeshBasicMaterial( {
        map: ResourceManager.get('effects-shadow'),
        transparent: true,
        side: THREE.FrontSide
      } )
      geometry = new THREE.PlaneGeometry(1, 1)
    }

    this.scale = SCALES[ material.map.image.width ]
    this.initialY = this.object.position.y

    this.shadow = new THREE.Mesh(geometry, material)
    this.shadow.scale.set(this.scale, this.scale, this.scale)
    this.shadow.rotateX(-Math.PI / 2)
    this.shadow.position.y = -0.4999
    // this.object.add(this.shadow)
  }

  update () {
    var fixedScale = this.scale - (this.initialY - this.object.position.y)
      // console.log(this.initialY, this.initialY - this.object.position.y)
    // console.log(this.object.position.y, fixedScale)
    this.shadow.scale.set(fixedScale, fixedScale, fixedScale)
  }

  onDestroy () {
    // this.object.remove(this.shadow)
  }


}
