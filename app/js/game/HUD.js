import Lifebar from '../hud/Lifebar'
import ExpBar from '../hud/ExpBar'
import Resources from '../hud/Resources'
import Character from '../hud/Character'
import LevelUpButton from '../hud/LevelUpButton'
import { Text2D, textAlign } from 'three-text2d'

window.HUD_MARGIN = 2.5
window.HUD_SCALE = 9

export default class HUD {

  constructor () {

    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 1, 10 );
    this.camera.position.z = 10

    this.scene = new THREE.Scene()

    // Life / Mana / Expr
    this.manabar = new Lifebar('mana')
    this.scene.add(this.manabar)

    this.lifebar = new Lifebar()
    this.scene.add(this.lifebar)

    this.expbar = new ExpBar()
    this.scene.add(this.expbar)

    //
    // Label
    this.selectionText = new Text2D("WELCOME", { font: "50px primary", fillStyle: '#fff', antialias: false })
    this.scene.add(this.selectionText)

    // Resources
    this.resources = new Resources()
    this.scene.add(this.resources)

    // Character
    this.character = new Character()
    this.scene.add(this.character)

    // Level Up Button
    this.levelUpButton = new LevelUpButton()
    // this.scene.add(this.levelUpButton)

    this.resize()
  }

  resize() {
    var characterMarginRatio = 8 // "magic number" due blank spaces on all sprites (they're all centered power-of-two)
    this.character.position.set(- window.innerWidth / 2 + this.character.width + HUD_MARGIN * characterMarginRatio, window.innerHeight / 2 - this.character.height - HUD_MARGIN * characterMarginRatio, 0)
    this.levelUpButton.position.set(this.character.position.x + HUD_MARGIN * HUD_SCALE, this.character.position.y - this.levelUpButton.height + (HUD_SCALE/3 * HUD_SCALE), 1)

    // selection text
    this.selectionText.position.set(0, window.innerHeight / 2 - (HUD_MARGIN * HUD_SCALE), 0)

    this.lifebar.position.set(- window.innerWidth / 2 + this.lifebar.width, - window.innerHeight / 2 + this.lifebar.height * 1.7, 0)
    this.manabar.position.set(- window.innerWidth / 2 + this.lifebar.width * 1.65, this.lifebar.position.y - HUD_SCALE, 0)
    this.expbar.position.set(- window.innerWidth / 2 + this.lifebar.width + HUD_SCALE * 2, this.lifebar.position.y - this.lifebar.height, 0)

    this.resources.position.set(window.innerWidth / 2 - this.resources.width * HUD_MARGIN, window.innerHeight / 2 - this.resources.height * HUD_MARGIN, 0)

    // update orthogonal camera aspect ratio / projection matrix
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.left = - window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = - window.innerHeight / 2;
    this.camera.updateProjectionMatrix();
  }

}

