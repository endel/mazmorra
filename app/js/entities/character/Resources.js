var initialized = false

export default class Resources {

  static init () {
    if (initialized) return true;

    //
    // TODO:
    // use a single sprite for eyes and bodies, with multiple colors
    //

    this.body = this.withDirections('body-0')
    this.eye = [this.withDirections('eyes-0')]

    this.hair = [
      null,
      this.withDirections('hair-0'),
      this.withDirections('hair-1'),
      this.withDirections('hair-2'),
      this.withDirections('hair-3'),
      this.withDirections('hair-4'),
      this.withDirections('hair-5'),
      this.withDirections('hair-6'),
      this.withDirections('hair-7'),
      this.withDirections('hair-8'),
      this.withDirections('hair-9'),
      this.withDirections('hair-10'),
    ]

    this.colors = {
      body: [
        new THREE.Color(0xe8c498), // white
        new THREE.Color(0xcca874), // brown-1
        new THREE.Color(0xb49054), // brown-2
        new THREE.Color(0x9c7c3c), // black
      ],
      hair: [
        new THREE.Color(0xd0c01c), // yellow
        new THREE.Color(0x443434), // brown-1
        new THREE.Color(0x503008), // brown-2
        new THREE.Color(0xc0c0c0), // grey
        new THREE.Color(0xf08414), // redhead
      ],
      eye: [
        new THREE.Color(0x185090), // blue
        new THREE.Color(0x603810), // brown-1
        new THREE.Color(0x2c1800), // black
        new THREE.Color(0x3c8008), // green
      ]
    }

    this.cloth = [
      this.withDirections('clothes-0'),
      this.withDirections('clothes-1'),
      this.withDirections('clothes-2'),
    ]

    this.cape = [
      this.withDirections('cape-0'),
      this.withDirections('cape-1'),
      this.withDirections('cape-2'),
    ]

    this.item = [ this.withDirections('items-0') ]

    initialized = true
  }

  static get (type, index = null) {
    return (index == null) ? this[type] : (this[type] && this[type][index])
  }

  static getColor (type, index) {
    return this.colors[type][index]
  }

  static withDirections (identifier) {
    return {
      top: ResourceManager.get('character-'+identifier+'-top'),
      bottom: ResourceManager.get('character-'+identifier+'-bottom'),
      left: ResourceManager.get('character-'+identifier+'-left'),
      right: ResourceManager.get('character-'+identifier+'-right'),
    }
  }

}
