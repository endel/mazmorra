import Clock from 'clock.js'
import Keyboard from './Keyboard'
import Level from './Level'
import HUD from './HUD'
import { createComponentSystem } from 'behaviour.js'

window.TILE_SIZE = 3
window.CLEAR_COLOR = 0x000 // window.CLEAR_COLOR = 0x282828
window.clock = new Clock();

// sprite scales based on the texture size
window.SCALES = {
  32: 6,
  16: 3,
  8: 1.5,
  4: 0.75
}

export default class Game {

  constructor (container) {
    this.container = container
    this.container.innerHTML = "";

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor( CLEAR_COLOR );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.autoClear = false;

    this.scene = new THREE.Scene();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 20000 );
    // this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1, 100 );
    // this.camera.zoom = 20
    // this.camera.updateProjectionMatrix()
    // this.scene.rotateY(-1)

    // this.camera.position.y = 10;
    // this.camera.position.y = 15;
    // this.camera.position.y = 30;
    this.camera.position.y = 40;
    // this.camera.position.z = 10;
    // this.camera.position.z = 20
    // this.camera.position.z = 30;
    this.camera.position.z = 50;

    window.camera = this.camera

    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.container.appendChild( this.stats.domElement );

    //
    // setup scene
    //
    this.componentSystem = createComponentSystem(THREE.Object3D)

    // this.scene.fog = new THREE.FogExp2( 0xffffff, 0.00015 );
    this.scene.fog = new THREE.FogExp2( CLEAR_COLOR, 0.01 );
    // this.scene.rotation

    this.keyboard = new Keyboard(this.player)

    this.level = new Level(this.scene, this.camera)
    window.scene = this.scene

    this.hud = new HUD()

    this.updateInterval = setInterval(this.update.bind(this), 1000 / 60)

    this.container.appendChild( this.renderer.domElement );
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    window.addEventListener( 'mousemove', this.onMouseMove.bind(this), false )
  }

  onWindowResize () {
    this.hud.resize()

    // update camera aspect ratio / projection matrix
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    // this.cameraController.handleResize();
  }

  onMouseMove( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  update () {
    clock.tick()
    this.componentSystem.update()
    tweener.update(clock.deltaTime)

    // update camera position
    // let position = this.level.players[0].position
    // this.camera.position.set(position.x, position.y, position.z)
    // this.camera.lookAt(position)

    this.stats.update()

    // this.keyboard.update(clock.delta)
  }



  render () {
    requestAnimationFrame( this.render.bind(this) );
    this.raycast()
    this.renderer.clear()
    this.renderer.render( this.scene, this.camera );
    this.renderer.clearDepth();
    this.renderer.render( this.hud.scene, this.hud.camera )
  }

  raycast () {
    this.raycaster.setFromCamera( this.mouse, this.camera );

    var intersects = this.raycaster.intersectObjects( this.level.generator.ground );
    for ( var i = 0; i < intersects.length; i++ ) {
      this.level.setTileSelection(intersects[i].object)
      break;
    }
  }

}
