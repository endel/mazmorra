var data = require('./data.json')

export default class ResourceManager {

  static clone(identifier) {
    return this.get(identifier).clone()
  }

  static get(identifier) {
    return this.textures[ identifier ]
  }

  static load (callback = null) {
    var loader = new THREE.TextureLoader();

    this.textures = {}
    this.texturesLoaded = 0

    for (var i=0; i<data.length; i++) {
      let name = data[i].match(/\/(.*)\.png$/)[1]
      loader.load(data[i], (texture) => {
        this.textures[ name ] = texture
        this.textures[ name ].magFilter = THREE.NearestFilter
        this.textures[ name ].minFilter = THREE.LinearMipMapLinearFilter

        if (name.match(/^tile/)) {
          this.textures[ name ].wrapS = this.textures[ name ].wrapT = THREE.RepeatWrapping;
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

