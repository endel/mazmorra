var Keycode = require('keycode.js')

export default class Keyboard {

  constructor (object, domElement = null) {
    this.object = object
    this.domElement = ( domElement !== null ) ? domElement : document;

    this.moveForward = false
    this.moveBackward = false

    this.moveLeft = false
    this.moveRight = false

    this.moveUp = false
    this.moveDown = false

    this.movementSpeed = 150
    this.autoSpeedFactor = 0.001

    this._onKeyDown = this.onKeyDown.bind(this)
    this._onKeyUp = this.onKeyUp.bind(this)
    this._onMouseDown = this.onMouseDown.bind(this)
    this._onMouseUp = this.onMouseUp.bind(this)

    this.bind()
  }

  bind () {
    this.domElement.addEventListener( 'mousedown', this._onMouseDown, false );
    this.domElement.addEventListener( 'mouseup', this._onMouseUp, false );

    window.addEventListener( 'keydown', this._onKeyDown, false );
    window.addEventListener( 'keyup', this._onKeyUp, false );
  }

  update (delta) {
    var actualMoveSpeed = delta * this.movementSpeed;

    if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
    if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

    if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
    if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

    if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
    if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );
  }

  onKeyDown (e) {
    if (e.which == Keycode.LEFT || e.which == Keycode.A) {
      this.moveLeft = true

    } else if (e.which == Keycode.RIGHT || e.which == Keycode.D) {
      this.moveRight = true

    } else if (e.which == Keycode.UP || e.which == Keycode.W) {
      this.moveForward = true

    } else if (e.which == Keycode.DOWN || e.which == Keycode.S) {
      this.moveBackward = true
    }

    // this.moveUp = (e.which == Keycode.UP || e.which == Keycode.W)
    // this.moveDown = (e.which == Keycode.DOWN || e.which == Keycode.S)
  }

  onKeyUp (e) {
    if (e.which == Keycode.LEFT || e.which == Keycode.A) {
      this.moveLeft = false

    } else if (e.which == Keycode.RIGHT || e.which == Keycode.D) {
      this.moveRight = false

    } else if (e.which == Keycode.UP || e.which == Keycode.W) {
      this.moveForward = false

    } else if (e.which == Keycode.DOWN || e.which == Keycode.S) {
      this.moveBackward = false
    }
  }

  onMouseDown( e ) {
    e.preventDefault();
    e.stopPropagation();
  }

  onMouseUp ( e ) {
    e.preventDefault();
    e.stopPropagation();
  }

}
