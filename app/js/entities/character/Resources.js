var initialized = false
  , characters = {}

const MAX_CHAR_WIDTH = 7
    , MAX_CHAR_HEIGHT = 10
    , TOTAL_CHAR_WIDTH = 7 * 5

    , TEXTURE_SIZE = 256

import { or } from 'precedence'

export default class Resources {

  static init () {
    this.offset = 0
    this.availableOffsets = []

    // available colors to pick
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
    this.directions = ['bottom', 'left', 'top', 'right']

    this.textureImage = document.createElement('img')
    this.texture = new THREE.Texture(this.textureImage)

    // montage canvas
    this.textureCanvas = document.createElement('canvas')
    this.textureCanvas.height = TEXTURE_SIZE
    this.textureCanvas.width = TEXTURE_SIZE
    this.textureCanvasCtx = this.textureCanvas.getContext('2d')

    this.montage = document.createElement('canvas')
    this.montage.height = MAX_CHAR_HEIGHT
    this.montage.width = MAX_CHAR_WIDTH

    this.buffer = document.createElement('canvas')
    this.buffer.height = MAX_CHAR_HEIGHT
    this.buffer.width = MAX_CHAR_WIDTH

    initialized = true
  }

  static getCurrentOffset () {
    if (!initialized) { this.init() }
    return or( this.availableOffsets.shift(), this.offset++ )
  }

  static get (character) {
    var di = this.directions.indexOf(character._direction)
    return characters[character][di]
  }

  static deleteTexture (character) {
    // flag deleted offset as avaialble for reuse
    this.availableOffsets.push(character.textureOffset)

    delete characters[character]
  }

  static updateTexture (character) {
    var layers = ['body', 'cloth', 'cape', 'hair', 'eye']
      , layersToColorize = ['hair', 'body', 'eye']

      , currentLayer = 0
      , montageCtx = this.montage.getContext('2d')
      , bufferCtx = this.buffer.getContext('2d')

    // clear only this character on global texture canvas
    this.textureCanvasCtx.clearRect(character.textureOffset * TOTAL_CHAR_WIDTH, 0, TOTAL_CHAR_WIDTH, MAX_CHAR_HEIGHT)

    for (var di = 0; di < this.directions.length; di++) {
      let direction = this.directions[ di ]
      montageCtx.clearRect(0, 0, MAX_CHAR_WIDTH, MAX_CHAR_HEIGHT)

      for (var i = 0; i < layers.length; i++) {
        let layer = layers[i]
          , texture = ResourceManager.get(`character-${ layer }-${ character.properties[layer] }-${direction}`)
          , frame = null
          , destX = 0
          , destY = 0
          , buffer = null

        if (texture) {
          frame = ResourceManager.getFrameData(`character-${ layer }-${ character.properties[layer] }-${direction}.png`)
        } else {
          continue;
        }

        destX = Math.floor(MAX_CHAR_WIDTH/2 - frame.w/2)

        if (layer === 'body') {
          destY = MAX_CHAR_HEIGHT - frame.h
        } else if (layer === 'eye') {
          destY = 2
        } else if (layer === 'cloth') {
          destY = 3
        } else if (layer === 'cape') {
          destY = MAX_CHAR_HEIGHT - frame.h - 1
          if (direction === 'left') {
            destX += 2
          } else if (direction === 'right') {
            destX -= 2
          }
        }

        bufferCtx.clearRect(0, 0, MAX_CHAR_WIDTH, MAX_CHAR_HEIGHT)
        bufferCtx.drawImage(texture.image, frame.x, frame.y, frame.w, frame.h, destX, destY, frame.w, frame.h)

        buffer = bufferCtx.getImageData(0, 0, MAX_CHAR_WIDTH, MAX_CHAR_HEIGHT)

        if (layersToColorize.indexOf(layer) !== -1) {
          let color = character.colors[ layer ]

          for (var j=0; j<buffer.data.length; j+=4) {
            let intensity = buffer.data[j]

            if (intensity > 1) {
              buffer.data[j] = color.r * intensity
              buffer.data[j + 1] = color.g * intensity
              buffer.data[j + 2] = color.b * intensity
            }
          }
        }

        bufferCtx.putImageData(buffer, 0, 0)
        montageCtx.drawImage(this.buffer, 0, 0)
      }

      this.textureCanvasCtx.drawImage(this.montage, di * MAX_CHAR_WIDTH, 0)
    }

    this.textureImage.src = this.textureCanvas.toDataURL()
    this.texture.image = this.textureImage
    this.texture.needsUpdate = true

    // this.texture = new THREE.Texture(this.textureCanvas)

    characters[character] = {}
    for (var di = 0; di < this.directions.length; di++) {
      let texture = this.texture.createInstance()
        , frame = {
            x: (character.textureOffset * TOTAL_CHAR_WIDTH) + (di * MAX_CHAR_WIDTH),
            y: 0,
            w: MAX_CHAR_WIDTH,
            h: MAX_CHAR_HEIGHT
          }

      texture.frame = frame

      texture.repeat.x = frame.w / TEXTURE_SIZE
      texture.repeat.y = frame.h / TEXTURE_SIZE

      texture.offset.x = frame.x / TEXTURE_SIZE
      texture.offset.y = 1 - ((frame.y + frame.h) / TEXTURE_SIZE)

      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      texture.magFilter = THREE.NearestFilter
      texture.minFilter = THREE.LinearMipMapLinearFilter

      characters[character][di] = texture
    }

  }

}
