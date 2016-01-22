var data = require('./data.json')
var spritesheet = require('../../images/spritesheet.json')

// allow to clone textures without duplicating it in memory
THREE.Texture.prototype.createInstance = function() {
  var inst = this.clone();

  inst.uuid = this.uuid;
  inst.version = this.version;

  return inst;
}

var scaleRatio = 5.5
THREE.Vector3.prototype.normalizeWithTexture = function(texture, isMesh = false) {
  let ratio = (!isMesh) ? scaleRatio : Math.max(texture.frame.w, texture.frame.h)
  this.set(texture.frame.w / ratio, texture.frame.h / ratio, 1)
}

THREE.Vector3.prototype.normalizeWithHUDTexture = function(texture) {
  let ratio = HUD_SCALE
  this.set(texture.frame.w * ratio, texture.frame.h * ratio, 1)
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
    this.texturesTotal = 101

    loader.load('images/spritesheet.png', (texture) => {
      this.atlas = texture

      for (var filename in spritesheet.frames) {
        let name = filename.match(/(.*)\.png$/)[1]
        if (name.match(/^tile/)) { continue; }

        let frame = spritesheet.frames[filename].frame
          , texture = this.atlas.createInstance()

        texture.frame = frame

        texture.repeat.x = frame.w / spritesheet.meta.size.w
        texture.repeat.y = frame.h / spritesheet.meta.size.h

        texture.offset.x = frame.x / spritesheet.meta.size.w
        texture.offset.y = 1 - ((frame.y + frame.h) / spritesheet.meta.size.h)

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.LinearMipMapLinearFilter

        this.textures[ name ] = texture

      }
      this.texturesLoaded ++
      this.checkLoadComplete(callback)
    })

    for (var i=0; i<data.length; i++) {
      let name = data[i].match(/sprites\/(.*)\.png$/)[1]
      if (!name.match(/^tile/)) continue;

      this.texturesTotal++

      loader.load(data[i], (texture) => {
        texture = texture
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.LinearMipMapLinearFilter

        // set repeat and create material / geometry for level tiles
        if (name.match(/^tile/)) {
          texture.repeat.set(3, 3)
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

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
        this.texturesLoaded ++

        this.checkLoadComplete(callback)
      })

    }

    this.texturesTotal -= 100
  }

  static checkLoadComplete (callback) {
    // all textures loaded successfully, call finished callback
    if (this.texturesLoaded == this.texturesTotal) {
      callback()
    }
  }


}

