// var data = require('./data.json')

var spritesheet = require('../../images/spritesheet.json')

// allow to clone textures without duplicating it in memory
THREE.Texture.prototype.createInstance = function() {
  var inst = this.clone();

  inst.uuid = this.uuid;
  inst.version = this.version;

  return inst;
}

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

    this.atlas = null
    this.textures = {}
    this.materials = {}
    this.geometries = {}

    this.texturesLoaded = 0

    loader.load('images/spritesheet.png', (texture) => {
      this.atlas = texture
      console.log(spritesheet)

      for (var filename in spritesheet.frames) {
        let texture = this.atlas.createInstance()
          , name = filename.match(/(.*)\.png$/)[1]
          // , data = spritesheet.frames[filename]
          , frame = spritesheet.frames[filename].frame

        texture.frame = frame

        texture.repeat.x = frame.w / spritesheet.meta.size.w
        texture.repeat.y = frame.h / spritesheet.meta.size.h

        texture.offset.x = frame.x / spritesheet.meta.size.w
        texture.offset.y = 1 - (frame.y / spritesheet.meta.size.h)

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // texture.needsUpdate = true

        // console.log(name, "offset:",   texture.offset.x, texture.offset.y, "repeat:", texture.repeat.x, texture.repeat.y)

        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.LinearMipMapLinearFilter

        if (name.match(/^tile/)) {
          texture.repeat.set(3, 3)
          // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

          this.materials[ name ] = new THREE.MeshPhongMaterial({
            // color: 0xa0adaf,
            // specular: 0x111111,
            // shininess: 60,
            shading: THREE.FlatShading,
            map: texture,
            side: THREE.DoubleSide
          })

          this.geometries[ name ] = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE)
        }

        this.textures[ name ] = texture
      }

      callback()
    })

    // for (var i=0; i<data.length; i++) {
    //   let name = data[i].match(/\/(.*)\.png$/)[1]
    //   loader.load(data[i], (texture) => {
    //     this.textures[ name ] = texture
    //     this.textures[ name ].magFilter = THREE.NearestFilter
    //     this.textures[ name ].minFilter = THREE.LinearMipMapLinearFilter
    //
    //     // set repeat and create material / geometry for level tiles
    //     if (name.match(/^tile/)) {
    //       this.textures[ name ].repeat.set(3, 3)
    //       this.textures[ name ].wrapS = this.textures[ name ].wrapT = THREE.RepeatWrapping;
    //
    //       this.materials[ name ] = new THREE.MeshPhongMaterial({
    //         // color: 0xa0adaf,
    //         // specular: 0x111111,
    //         // shininess: 60,
    //         shading: THREE.FlatShading,
    //         map: this.textures[ name ],
    //         side: THREE.DoubleSide
    //       })
    //       this.geometries[ name ] = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE)
    //     }
    //
    //     this.texturesLoaded ++
    //
    //     // all textures loaded successfully, call finished callback
    //     if (this.texturesLoaded == data.length) {
    //       callback()
    //     }
    //
    //   })
    //
    // }
  }

}

