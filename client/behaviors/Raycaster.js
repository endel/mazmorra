import { Behaviour } from 'behaviour.js'
import { MeshText2D, SpriteText2D } from 'three-text2d';

import Cursor from '../elements/hud/Cursor'

export default class Raycaster extends Behaviour {

  onAttach (camera, parentRaycaster = null) {

    this.camera = camera

    this.raycaster = new THREE.Raycaster()

    this.parentRaycaster = parentRaycaster || null

    this.targetObject = null

    this.path = null

    // do raycast at every 200ms
    setInterval(() => this.doRaycast(), 200);

    window.addEventListener( "mousemove", this.doRaycast.bind(this), false )
    window.addEventListener( "touchstart", this.onTouchStart.bind(this), false )
    window.addEventListener( "touchend", this.onTouchEnd.bind(this), false )
    window.addEventListener( "click", this.onClick.bind(this), false )
    window.addEventListener( "mousedown", this.onMouseDown.bind(this), false )
    window.addEventListener( "mouseup", this.onMouseUp.bind(this), false )

  }

  get isParentLayerActive () {
    return (
      this.parentRaycaster &&
      this.parentRaycaster.targetObject
    )
  }

  get isTargetReachable () {
    return this.targetObject && !this.isParentLayerActive
  }

  doRaycast () {

    // skip if parent layer (HUD) is active
    if ( this.isParentLayerActive ) { return }

    this.raycaster.setFromCamera( App.mouse, this.camera )

    this.path = this.raycaster.intersectObject( this.object, true )

    // let nextTargetObject = (this.path.length > 0) && this.path[0].object
    let nextTargetObject;

    for (let i = 0, l = this.path.length; i < l; i++) {
      const object = this.path[i].object;

      if (object.userData.type === "walkable") {
        nextTargetObject = this.path[i].object;
        break;

      } else if (object.parent.userData.type === "walkable" || object.parent.userData.hud) {
        nextTargetObject = this.path[i].object.parent;
        break;
      }
    }

    if (this.targetObject !== nextTargetObject) {

      // mouseout
      if (this.targetObject) {
        this.targetObject.dispatchEvent({
          type: "mouseout",
          bubbles: true,
          path: this.path
        })
      }

      // mouseover
      if (nextTargetObject) {
        nextTargetObject.dispatchEvent({
          type: "mouseover",
          bubbles: true,
          path: this.path
        })
      }

    }

    this.targetObject = nextTargetObject
  }

  onTouchStart (e) {
    if (e.touches && e.touches[0]) {
      let touch = e.touches[0]

      App.onMouseMove( touch )

      this.onClick( e )
    }
  }

  onTouchEnd (e) {
    if (e.touches && e.touches[0] && this.isTargetReachable) {

      this.targetObject.dispatchEvent({
        type: "touchend",
        bubbles: true,
        path: this.path
      })

    }
  }

  onClick (e) {

    this.doRaycast()

    console.log(this.targetObject);

    if ( this.isTargetReachable ) {

      e.preventDefault()

      this.targetObject.dispatchEvent({
        type: "click",
        bubbles: true,
        path: this.path
      })

    }
  }

  onMouseDown () {

    if ( this.isTargetReachable ) {

      this.targetObject.dispatchEvent({
        type: "mousedown",
        bubbles: true,
        path: this.path
      })

    }

  }

  onMouseUp () {

    if ( this.isTargetReachable ) {

      this.targetObject.dispatchEvent({
        type: "mouseup",
        bubbles: true,
        path: this.path
      })

    }

  }

  onDetach () {
  }


}
