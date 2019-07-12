const data = require('./data.json');
const spritesheet = require('../../public/images/spritesheet.json');
const config = require('../config');

// allow to clone textures without duplicating it in memory
THREE.Texture.prototype.createInstance = function() {
  let inst = this.clone();

  inst.uuid = this.uuid;
  inst.version = this.version;

  return inst;
}

const scaleRatio = 5.6;
THREE.Vector3.prototype.normalizeWithTexture = function(texture, isMesh = false) {
  if (texture) {
    let ratio = (!isMesh) ? scaleRatio : Math.max(texture.frame.w, texture.frame.h);
    this.set(texture.frame.w / ratio, texture.frame.h / ratio, 1);
  } else {
    console.log("texture is undefined!?");
  }
}

THREE.Vector3.prototype.normalizeWithHUDTexture = function(texture) {
  let ratio = config.HUD_SCALE;
  this.set(texture.frame.w * ratio, texture.frame.h * ratio, 1);
}

class ResourceManager {

  static clone(identifier) {
    return this.get(identifier).clone();
  }

  static get(identifier) {
    return this.textures[ identifier ];
  }

  static createTileMesh(identifier) {
    const mesh = new THREE.Mesh(this.geometries[ identifier ], this.materials[ identifier ]);
    return mesh;
  }

  static getSprite (identifier) {
    let tex = ResourceManager.get( identifier );
    let sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex }));
    sprite.scale.normalizeWithTexture(tex);
    return sprite;
  }

  static getHUDElement(identifier) {
    let tex = ResourceManager.get(identifier)
      , element = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));

    element.height = tex.frame.h * config.HUD_SCALE;
    element.width = tex.frame.w * config.HUD_SCALE;
    element.scale.set(element.width, element.height, 1);

    element.userData.hud = true;

    return element;
  }

  static getFrameData (filename) {
    return spritesheet.frames[filename].frame;
  }

  static load (callback = null) {
    let loader = new THREE.TextureLoader();

    this.atlas = null;
    this.textures = {};
    this.materials = {};
    this.geometries = {};

    this.texturesLoaded = 0;
    this.texturesTotal = 101;

    const cacheBuster = Math.random().toString().replace(".", "");

    loader.load(`images/spritesheet.png?${cacheBuster}`, (texture) => {
      this.atlas = texture;

      for (let filename in spritesheet.frames) {
        let name = filename.match(/(.*)\.png$/)[1]
        if (name.match(/^tile/)) {
          continue;
        }

        let frame = spritesheet.frames[filename].frame
          , texture = this.atlas.createInstance();

        texture.frame = frame;

        texture.repeat.x = frame.w / spritesheet.meta.size.w;
        texture.repeat.y = frame.h / spritesheet.meta.size.h;

        texture.offset.x = frame.x / spritesheet.meta.size.w;
        texture.offset.y = 1 - ((frame.y + frame.h) / spritesheet.meta.size.h);

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;;

        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        this.textures[ name ] = texture;

      }
      this.texturesLoaded ++;
      this.checkLoadComplete(callback);
    })

    for (let i=0; i<data.length; i++) {
      let name = data[i].match(/sprites\/(.*)\.png$/)[1];
      if (!name.match(/^tile/)) continue;

      this.texturesTotal++;

      loader.load(data[i], (texture) => {
        texture = texture;
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        // set repeat and create material / geometry for level tiles
        if (name.match(/^tile/)) {
          texture.repeat.set(2, 2);
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

          // TODO: use this material for "ice" map
          // THREE.MeshStandardMaterial

          // Default:
          // MeshPhongMaterial

          // I like this one!
          // THREE.MeshLambertMaterial

          this.materials[ name ] = new THREE.MeshPhongMaterial({ //new THREE.MeshBasicMaterial({
            // color: 0xa0adaf,
            // specular: 0x111111,
            shininess: 60,
            // flatShading: true,
            map: texture,
            side: THREE.DoubleSide,
            // depthWrite: false
          });

          // if (name.indexOf('-wall') >= 0) {
          //   // walls are boxes
          //   this.geometries[name] = new THREE.BoxGeometry(config.TILE_SIZE, config.TILE_SIZE, config.WALL_THICKNESS)

          // } else {
            this.geometries[name] = new THREE.PlaneGeometry(config.TILE_SIZE, config.TILE_SIZE);

          // }
        }

        this.textures[ name ] = texture;
        this.texturesLoaded ++;

        this.checkLoadComplete(callback);
      })

    }

    this.texturesTotal -= 100;
  }

  static checkLoadComplete (callback) {
    // all textures loaded successfully, call finished callback
    if (this.texturesLoaded == this.texturesTotal) {
      callback();
    }
  }


}

module.exports = ResourceManager;
