import Clock from 'clock.js'
import Keyboard from './Keyboard'
import Level from './Level'
import { createComponentSystem } from 'behaviour.js'

export default class Game {

  constructor (container) {
    this.container = container
    this.container.innerHTML = "";

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor( 0xffffff );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.autoClear = false;

    this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 20000 );
    // this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 500, 1000 );
    this.camera.position.y = 10;
    this.camera.position.z = 10;

    window.camera = this.camera

    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.container.appendChild( this.stats.domElement );


    //
    // setup scene
    //
    this.componentSystem = createComponentSystem(THREE.Object3D)

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2( 0xffffff, 0.00015 );
    // this.scene.rotation

    this.keyboard = new Keyboard(this.player)
    this.clock = new Clock();

    this.level = new Level(this.scene, this.camera)
    window.scene = this.scene

    this.updateInterval = setInterval(this.update.bind(this), 1000 / 60)

    this.container.appendChild( this.renderer.domElement );
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
  }

  onWindowResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    // this.cameraController.handleResize();
  }

  update () {
    this.clock.tick()
    this.componentSystem.update()
    tweener.update(this.clock.deltaTime)
    this.level.update()

    // update camera position
    // let position = this.level.players[0].position
    // this.camera.position.set(position.x, position.y, position.z)
    // this.camera.lookAt(position)

    // this.level.update()
    this.stats.update()

    // this.keyboard.update(this.clock.delta)
  }

  render () {
    requestAnimationFrame( this.render.bind(this) );
    this.renderer.render( this.scene, this.camera );
  }

}
