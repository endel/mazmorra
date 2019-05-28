import HUD from './HUD'

import Level from './level/Level'
import CharacterBuilder from './character/Builder'
import Raycaster from '../behaviors/Raycaster'

import config from '../config'

export default class Game {

  constructor (container) {
    this.container = container
    this.container.innerHTML = "";


    this.renderer = new THREE.WebGLRenderer();
    // this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.autoClear = false;

    // this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000 );
    // this.camera.zoom = config.ZOOM / 15
    // this.camera.updateProjectionMatrix()

    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1, 1000 );
    this.camera.zoom = config.ZOOM
    this.camera.updateProjectionMatrix()

    // ORTOGRAPHIC
    // this.camera.position.y = 10;
    // this.camera.position.y = 15;
    // this.camera.position.y = 30;
    this.camera.position.y = 40;
    // this.camera.position.z = 10;
    // this.camera.position.z = 20
    // this.camera.position.z = 30;
    this.camera.position.z = 50;

    let hudRaycaster = new Raycaster
    this.hud = new HUD()
    this.hud.addBehaviour( hudRaycaster, this.hud.camera )

    this.scene = new THREE.Scene();
    // this.scene.rotateY(-0.4)
    this.scene.addBehaviour( new Raycaster, this.camera, hudRaycaster )

    // this.level = new Level(this.scene, this.hud, this.camera)
    // this.level.on('setup', this.onSetupLevel.bind(this))

    this.characterBuilder = new CharacterBuilder( this.hud, this.camera )
    this.characterBuilder.addEventListener( "complete", this.init.bind(this) )
    this.scene.add( this.characterBuilder )

    // set background for character builder
    this.onSetupLevel({
      state: {
        mapkind: 'rock',
        daylight: true
      }
    })

    this.updateInterval = setInterval(this.update.bind(this), 1000 / 60)
    this.container.appendChild( this.renderer.domElement );

    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

    // // stats
    // this.stats = new Stats();
    // this.stats.domElement.style.position = 'absolute';
    // this.stats.domElement.style.top = '0px';
    // this.container.appendChild( this.stats.domElement );
  }

  init () {
    this.level = new Level(this.hud, this.camera);
    this.level.addEventListener("setup", this.onSetupLevel.bind(this));
    this.level.addEventListener("died", () => this.hud.showOverlay(2000));
    this.scene.add(this.level);
    this.hud.init();
  }

  onSetupLevel (e) {
    this.hud.hideOverlay();

    let clearColor = (e.state.daylight) ? config.colors[ e.state.mapkind ] : config.colors.dark
    this.renderer.setClearColor( clearColor );
    // this.scene.fog = new THREE.FogExp2( clearColor, 1 );
  }

  onWindowResize () {
    if (this.hud) this.hud.resize()

    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    // // update camera aspect ratio / projection matrix
    // this.camera.aspect = window.innerWidth / window.innerHeight;

    // update orthogonal camera aspect ratio / projection matrix
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.left = - WIDTH / 2;
    this.camera.right = WIDTH / 2;
    this.camera.top = HEIGHT / 2;
    this.camera.bottom = - HEIGHT / 2;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize( WIDTH, HEIGHT );
  }

  update () {

    App.update()

  }

  render () {

    requestAnimationFrame( this.render.bind(this) );

    this.renderer.clear()
    this.renderer.render( this.scene, this.camera );
    this.renderer.clearDepth();

    if (this.hud) {

      this.renderer.render( this.hud, this.hud.camera )

    }

  }

}
