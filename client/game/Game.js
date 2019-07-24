import HUD from './HUD'

import Level from './level/Level'
import CharacterBuilder from './character/Builder'
import Raycaster from '../behaviors/Raycaster'
import login from '../web/login'

import config from '../config'
import { getLightPoolCount, getLightFromPool, removeLight } from '../utils';
import { PlayerPrefs } from '../core/PlayerPrefs';
import { setHeroId } from '../core/network';

export default class Game {

  constructor (container) {
    this.container = container
    this.container.innerHTML = "";

    this.renderer = new THREE.WebGLRenderer(); // {alpha: true}
    global.renderer = this.renderer;

    // Use clipping for health bars?
    // this.renderer.localClippingEnabled = true;

    // this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize( window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;

    // this.renderer.shadowMap.enabled = false;
    // this.renderer.shadowMap.autoUpdate = false;

    // this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000 );
    // this.camera.zoom = config.ZOOM / 15
    // this.camera.updateProjectionMatrix()

    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1, 1000 );
    this.camera.zoom = config.ZOOM;
    this.camera.updateProjectionMatrix();

    global.camera = this.camera;

    // ORTOGRAPHIC
    // this.camera.position.y = 10;
    // this.camera.position.y = 15;
    // this.camera.position.y = 30;
    this.camera.position.y = 40;
    // this.camera.position.z = 10;
    // this.camera.position.z = 20
    // this.camera.position.z = 30;
    this.camera.position.z = 50;

    let hudRaycaster = new Raycaster();
    this.hud = new HUD();
    this.hud.addBehaviour(hudRaycaster, this.hud.camera);

    this.scene = new THREE.Scene();
    // this.scene.rotateY(-0.4)
    this.scene.addBehaviour(new Raycaster(), this.camera, hudRaycaster);

    global.scene = this.scene;
    for (let i=0;i<getLightPoolCount();i++) {
      removeLight(getLightFromPool());
    }

    // bind callbacks to this
    this.onSetupLevel = this.onSetupLevel.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    // set background for character builder
    this.onSetupLevel({
      state: {
        mapkind: 'rock',
        daylight: true
      }
    })

    this.updateInterval = setInterval(this.update, 1000 / 60)
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.onWindowResize, false);

    // // stats
    // this.stats = new Stats();
    // this.stats.domElement.style.position = 'absolute';
    // this.stats.domElement.style.top = '0px';
    // this.container.appendChild( this.stats.domElement );
  }

  buildCharacter(heroData) {
    // this.renderer.setClearColor(config.colors.dark, 0.35);
    // this.renderer.setClearAlpha(0);

    this.characterBuilder = new CharacterBuilder(this.hud, this.camera);
    this.characterBuilder.addEventListener("complete", () => this.createHero(heroData));
    this.characterBuilder.setHero(heroData);;

    this.scene.add(this.characterBuilder);
  }

  async createHero(data) {
    const hero = await login.createHero({ ...this.characterBuilder.getHero(), ...data });

    setHeroId(hero._id);

    // clean-up character builder
    this.scene.remove(this.characterBuilder);
    this.characterBuilder.destroy();

    // this.container.classList.remove("wardrobe");
    this.init();
  }

  init () {
    this.level = new Level(this.hud, this.camera);
    this.level.addEventListener("setup", this.onSetupLevel);
    this.level.addEventListener("died", () => this.hud.showOverlay(2000));
    this.scene.add(this.level);
    this.hud.init();
  }

  onSetupLevel (e) {
    this.hud.hideOverlay();

    let clearColor = (e.state.daylight) ? config.colors[e.state.mapkind] : config.colors.dark
    this.renderer.setClearColor(clearColor);
    // this.renderer.setClearAlpha(1);
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
    App.update();
  }

  render () {
    requestAnimationFrame(this.render);

    this.renderer.clear()
    this.renderer.render( this.scene, this.camera );
    this.renderer.clearDepth();

    if (this.hud) {
      this.renderer.render( this.hud, this.hud.camera )
    }
  }

}
