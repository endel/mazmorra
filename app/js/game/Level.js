import PF from 'pathfinding'

import Generator from './level/Generator'

import CharacterController from '../behaviors/CharacterController'

import Character from '../entities/Character'
import Enemy from '../entities/Enemy'
import Item from '../entities/Item'
import Chest from '../entities/Chest'
import TileSelectionPreview from '../entities/TileSelectionPreview'
import LightPole from '../entities/LightPole'

export default class Level {

  constructor (scene, camera) {
    this.scene = scene
    this.camera = camera

    // // ambient light
    // var light = new THREE.AmbientLight( 0xffffff ); // soft white light
    // this.scene.add( light );

    this.selection = new TileSelectionPreview()
    this.selectionLight = new THREE.SpotLight(0xffffff, 0.5, 30);
    this.scene.add(this.selectionLight)

    // grid / generator / pathfinder
    this.generator = new Generator(this.scene)
    this.grid = this.generator.generate()
    this.pathfinder = new PF.Grid(this.grid)

    this.generator.createElements(this.grid)

    var character = new Character('man')
    character.behave(new CharacterController, camera)
    this.scene.add(character)

    camera.lookAt(character.position)

    // var lightPole = new LightPole()
    // lightPole.position.copy(character.position)
    // lightPole.position.z -= 10
    // lightPole.position.x -= 10
    // this.scene.add(lightPole)
    //
    // var lightPole = new LightPole()
    // lightPole.position.copy(character.position)
    // lightPole.position.z -= 30
    // lightPole.position.x = 5
    // this.scene.add(lightPole)
    //
    // var enemy = new Enemy('rat')
    // enemy.position.x = -6
    // this.scene.add(enemy)
    //
    // var enemy = new Enemy('bat')
    // enemy.position.x = -10
    // this.scene.add(enemy)
    //
    // // var enemy = new Enemy('demon')
    // // enemy.position.x = -12
    // // this.scene.add(enemy)
    //
    // var enemy = new Enemy('green-snake')
    // enemy.position.x = -8
    // this.scene.add(enemy)
    //
    // var item = new Item('sword')
    // item.position.x = 3
    // this.scene.add(item)
    //
    // var item = new Item('gold')
    // item.position.z = 3
    // item.position.x = 3
    // this.scene.add(item)
    //
    // var item = new Item('life-potion')
    // item.position.z = 3
    // item.position.x = 6
    // this.scene.add(item)
    //
    // var item = new Item('mana-potion')
    // item.position.z = 3
    // this.scene.add(item)
    //
    // var item = new Item('elixir-potion')
    // item.position.x = -3
    // item.position.z = 3
    // this.scene.add(item)
    //
    // var item = new Item('mana-heal')
    // item.position.x = -6
    // item.position.z = 3
    // this.scene.add(item)
    //
    // var item = new Item('life-heal')
    // item.position.x = -9
    // item.position.z = 3
    // this.scene.add(item)
    //
    // var item = new Item('shield-metal')
    // item.position.x = 6
    // this.scene.add(item)
    //
    // var chest = new Chest()
    // chest.position.x = -3
    // this.scene.add(chest)
  }

  setTileSelection (object) {
    object.add(this.selection)
    this.selectionLight.position.set(object.position.x, 2, object.position.z)
    this.selectionLight.target = object
  }

}
