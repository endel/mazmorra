import Character from '../entities/Character'
import Enemy from '../entities/Enemy'
import Item from '../entities/Item'
import Chest from '../entities/Chest'

export default class Level {

  constructor (scene, camera) {
    this.scene = scene
    this.camera = camera
    this.entities = []

    var floorTexture = ResourceManager.get('tile-rock-ground')
    floorTexture.repeat.set(300, 300)
    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;

    var wallTexture = ResourceManager.get('tile-rock-wall')
    wallTexture.repeat.set(3, 3)
    var wallMaterial = new THREE.MeshBasicMaterial( { map: wallTexture, side: THREE.DoubleSide } );
    var wallGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    var wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.y = -0.5;
    wall.position.z = -3;
    wall.rotation.x = Math.PI;
    this.scene.add(wall);

    var character = new Character('man')
    character.position.y = 0.2
    this.scene.add(character)

    var enemy = new Enemy('rat')
    enemy.position.x = -6
    this.scene.add(enemy)

    var enemy = new Enemy('green-snake')
    enemy.position.x = -8
    this.scene.add(enemy)

    camera.lookAt(character.position)

    var light = new THREE.PointLight( 0xff0000, 1, 100 );
    light.position.copy(character.position)
    this.scene.add(light);

    var item = new Item('sword')
    item.position.y = 0
    item.position.x = 3
    this.scene.add(item)

    var item = new Item('gold')
    item.position.z = 5
    item.position.x = 3
    this.scene.add(item)

    var item = new Item('shield-metal')
    item.position.y = 0
    item.position.x = 8
    this.scene.add(item)

    var chest = new Chest()
    chest.position.x = -3
    this.scene.add(chest)

    this.scene.add(floor)

    this.entities.push(item)
    this.entities.push(character)
  }

  update () {
    var i = this.entities.length
    while (i--) {
      if (this.entities[i].update) {
        this.entities[i].update()
      }
    }
  }

}
