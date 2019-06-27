import { Behaviour } from 'behaviour.js'

export default class Raycaster extends Behaviour {

  onAttach (camera, parentRaycaster = null) {
    this.camera = camera
    this.raycaster = new THREE.Raycaster()
    this.parentRaycaster = parentRaycaster || null
    this.targetObject = null
    this.path = null

    // double tap (mobile)
    this.lastTapTarget = null;
    this.lastTapTime = Date.now();

    // do raycast at every 200ms
    setInterval(() => this.doRaycast(true), 200);

    window.addEventListener("mousemove", this.doRaycast.bind(this), false);
    window.addEventListener("touchstart", this.onTouchStart.bind(this), false);
    window.addEventListener("touchend", this.onTouchEnd.bind(this), false);
    window.addEventListener("click", this.onClick.bind(this), false);
    window.addEventListener("dblclick", this.onDoubleClick.bind(this), false);
    window.addEventListener("contextmenu", this.onContextMenu.bind(this), false);
    window.addEventListener("mousedown", this.onMouseDown.bind(this), false);
    window.addEventListener("mouseup", this.onMouseUp.bind(this), false);

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

  doRaycast (forceUpdate) {

    // skip if parent layer (HUD) is active
    if ( this.isParentLayerActive ) { return }

    this.raycaster.setFromCamera( App.mouse, this.camera )

    this.path = this.raycaster.intersectObject( this.object, true )

    // let nextTargetObject = (this.path.length > 0) && this.path[0].object
    let nextTargetObject;

    for (let i = 0, l = this.path.length; i < l; i++) {
      const object = this.path[i].object;

      if (object.parent.userData.interactive) {
        nextTargetObject = factory.getTileAt(object.parent.userData.position);
        break;

      } else if (object.userData.type === "walkable") {
        nextTargetObject = this.path[i].object;
        break;

      } else if (object.parent.userData.hud) {
        nextTargetObject = this.path[i].object.parent;
        break;
      }
    }

    if (
      this.targetObject !== nextTargetObject
      || forceUpdate // workaround for https://github.com/endel/mazmorra/issues/56
    ) {

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

      // allow to double click
      if (this.lastTapTarget == this.targetObject && Date.now() - this.lastTapTime < 200) {
        this.onDoubleClick(e);
        return;
      }

      App.onMouseMove(touch)
      this.doRaycast();

      this.onClick(e);
      this.lastTapTarget = this.targetObject;
      this.lastTapTime = Date.now();
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

  onClick(e) {
    // `doRaycast()` is already called on "mousedown" and "mouseup"
    // this.doRaycast()

    if (this.isTargetReachable && !App.cursor.isDroppingItem) {
      e.preventDefault()

      this.targetObject.dispatchEvent({
        type: "click",
        bubbles: true,
        path: this.path
      })
    }
  }

  onDoubleClick(e) {
    this.doRaycast()

    if (this.isTargetReachable) {
      e.preventDefault()

      this.targetObject.dispatchEvent({
        type: "dblclick",
        bubbles: true,
        path: this.path
      })
    }
  }

  onContextMenu (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onMouseDown(e) {
    this.doRaycast();

    App.cursor.isDroppingItem = false;

    if (this.isTargetReachable) {
      if (e.which === 3) {
        // allow right click on HUD elements.
        e.preventDefault();
        e.stopPropagation();
        this.onDoubleClick(e);

      } else {
        // left click!
        this.targetObject.dispatchEvent({
          type: "mousedown",
          bubbles: true,
          path: this.path
        })
      }
    }
  }

  onMouseUp(e) {
    if (this.isTargetReachable) {
      this.targetObject.dispatchEvent({
        type: "mouseup",
        bubbles: true,
        path: this.path
      })

    } else if (App.cursor.isDragging) {
      e.preventDefault();
      e.stopPropagation();

      App.cursor.dispatchEvent({ type: "mouseup" });
      App.cursor.isDroppingItem = true;
    }
  }

  onDetach () {
  }

}
