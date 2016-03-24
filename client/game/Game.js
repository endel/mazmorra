import HUD from './HUD'
import Device from '../utils/device'

import Level from './level/Level'
import CharacterBuilder from './character/Builder'

import config from '../config'

export default class Game {

  constructor (container) {
    this.container = container
    this.container.innerHTML = "";

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.autoClear = false;

    this.scene = new THREE.Scene();
    this.scene.rotateY(-0.4)

    // export scene for three.js devtool
    window.scene = this.scene

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000 );
    this.camera.zoom = config.ZOOM / 15
    this.camera.updateProjectionMatrix()

    // this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1, 100 );
    // this.camera.zoom = config.ZOOM
    // this.camera.updateProjectionMatrix()

    // ORTOGRAPHIC
    // this.camera.position.y = 10;
    // this.camera.position.y = 15;
    // this.camera.position.y = 30;
    this.camera.position.y = 40;
    // this.camera.position.z = 10;
    // this.camera.position.z = 20
    // this.camera.position.z = 30;
    this.camera.position.z = 50;

    window.camera = this.camera

    this.hud = new HUD()
    this.hud.cursor.mouse = this.mouse // TODO: refactor me
    this.hudCurrentControl = null
    // this.level = new Level(this.scene, this.hud, this.camera)
    // this.level.on('setup', this.onSetupLevel.bind(this))

    this.characterBuilder = new CharacterBuilder(this.scene, this.hud, this.camera)
    this.characterBuilder.on('complete', this.init.bind(this))
    // set background for character builder
    this.onSetupLevel({ mapkind: 'rock', daylight: true })

    this.updateInterval = setInterval(this.update.bind(this), 1000 / 60)
    this.container.appendChild( this.renderer.domElement );

    window.addEventListener( 'mousemove', this.onMouseMove.bind(this), false )
    window.addEventListener( 'touchstart', this.onTouchStart.bind(this), false )
    window.addEventListener( 'touchend', this.onTouchEnd.bind(this), false )
    window.addEventListener( 'click', this.onClick.bind(this), false )
    window.addEventListener( 'mousedown', this.onMouseDown.bind(this), false )
    window.addEventListener( 'mouseup', this.onMouseUp.bind(this), false )
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

    // // stats
    // this.stats = new Stats();
    // this.stats.domElement.style.position = 'absolute';
    // this.stats.domElement.style.top = '0px';
    // this.container.appendChild( this.stats.domElement );
  }

  init () {
    this.level = new Level(this.scene, this.hud, this.camera)
    this.level.on('setup', this.onSetupLevel.bind(this))
    this.hud.init()
  }

  onSetupLevel (state) {
    let clearColor = (state.daylight) ? config.colors[ state.mapkind ] : config.colors.dark

    this.renderer.setClearColor( clearColor );
    // this.scene.fog = new THREE.FogExp2( clearColor, 1 );
  }

  onWindowResize () {
    if (this.hud) this.hud.resize()

    // // update camera aspect ratio / projection matrix
    // this.camera.aspect = window.innerWidth / window.innerHeight;

    // update orthogonal camera aspect ratio / projection matrix
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.left = - window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = - window.innerHeight / 2;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    // this.cameraController.handleResize();
  }

  onTouchStart (e) {
    if (e.touches && e.touches[0]) {
      let touch = e.touches[0]
      this.onMouseMove(touch)

      this.raycast()

      if (this.level) {
        if (this.lastTargetPosition === this.level.targetPosition) {
          this.onClick(e)
        }
        this.lastTargetPosition = this.level.targetPosition;
      }
    }
  }

  onTouchEnd (e) {
    if (e.touches && e.touches[0] && this.hudCurrentControl) {
      this.hudCurrentControl.dispatchEvent({ type: 'touchend', cursor: this.hud.cursor  })
    }
  }

  onMouseMove (e) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
  }

  onClick (e) {
    if (this.hudCurrentControl) {
      this.hudCurrentControl.dispatchEvent({ type: 'click' })
      e.preventDefault()

    } else if (this.level) {
      this.level.playerAction()
      e.preventDefault()
    }
  }

  onMouseDown () {
    if (this.hudCurrentControl) {
      this.hudCurrentControl.dispatchEvent({ type: 'mousedown', cursor: this.hud.cursor })
    }
  }

  onMouseUp () {
    if (this.hudCurrentControl) {
      this.hudCurrentControl.dispatchEvent({ type: 'mouseup', cursor: this.hud.cursor  })
    }
  }

  update () {
    App.update()
    // this.stats.update()
  }

  render () {
    requestAnimationFrame( this.render.bind(this) );

    if (!Device.isMobile())
      this.raycast()

    this.renderer.clear()
    this.renderer.render( this.scene, this.camera );
    this.renderer.clearDepth();

    if (this.hud)
      this.renderer.render( this.hud, this.hud.camera )
  }

  raycast () {
    if (!this.raycastHUD()) {
      this.raycastScene();
    }
  }

  raycastScene () {
    if (!this.level) return false;

    this.raycaster.setFromCamera( this.mouse, this.camera );

    var intersects = this.raycaster.intersectObjects( this.level.generator.ground );
    if (intersects.length == 0) {
      this.level.setTileSelection(null)
    } else {
      this.level.setTileSelection(intersects[0].object)
    }
  }

  raycastHUD () {
    this.raycaster.setFromCamera( this.mouse, this.hud.camera );

    var intersects = this.raycaster.intersectObjects( this.hud.interactiveChildren, true )
      , nextControl = (intersects.length > 0) && intersects[0].object.parent

    if (this.hudCurrentControl !== nextControl) {
      // mouseout
      if (this.hudCurrentControl) {
        this.hudCurrentControl.dispatchEvent({ type: 'mouseout', cursor: this.hud.cursor  })
      }

      // mouseover
      if (nextControl) {
        nextControl.dispatchEvent({ type: 'mouseover', cursor: this.hud.cursor })
      }
    }

    this.hudCurrentControl = nextControl
    return this.hudCurrentControl;
  }

}
