var data = require('./data.json')

export default class ResourceManager {

  static clone(identifier) {
    return this.get(identifier).clone()
  }

  static get(identifier) {
    return this.textures[ identifier ]
  }

  static createTileMesh(identifier) {
    return new THREE.Mesh(this.geometries[ identifier ], this.materials[ identifier ])
  }

  static load (callback = null) {
    var loader = new THREE.TextureLoader();

    this.textures = {}
    this.materials = {}
    this.geometries = {}

    this.texturesLoaded = 0

    for (var i=0; i<data.length; i++) {
      let name = data[i].match(/\/(.*)\.png$/)[1]
      loader.load(data[i], (texture) => {
        this.textures[ name ] = texture
        this.textures[ name ].magFilter = THREE.NearestFilter
        this.textures[ name ].minFilter = THREE.LinearMipMapLinearFilter

        // set repeat and create material / geometry for level tiles
        if (name.match(/^tile/)) {
          this.textures[ name ].repeat.set(3, 3)
          this.textures[ name ].wrapS = this.textures[ name ].wrapT = THREE.RepeatWrapping;

          this.materials[ name ] = new THREE.MeshPhongMaterial({
            // color: 0xa0adaf,
            // specular: 0x111111,
            // shininess: 60,
            shading: THREE.FlatShading,
            map: this.textures[ name ],
            side: THREE.DoubleSide
          })
          this.geometries[ name ] = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE)
        }

        this.texturesLoaded ++

        // all textures loaded successfully, call finished callback
        if (this.texturesLoaded == data.length) {
          callback()
        }

      })

    }
  }

}

