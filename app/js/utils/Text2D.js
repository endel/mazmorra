// var texture = new THREE.Texture(canvas1);
// texture.needsUpdate = true;
//
// var material = new THREE.MeshBasicMaterial( { map: texture, side:THREE.DoubleSide } );
// material.transparent = true;
//
// var mesh = new THREE.Mesh(
//     new THREE.PlaneGeometry(canvas1.width, canvas1.height),
//     material
// );
//
// mesh.position.set(position.x + 10,position.y,position.z);
//
// scene.add( mesh );

// var fontAlignAnchor = {
//   center: new Vector2(),
//   left: new Vector2(-0.5, 0),
//   right: new Vector2(0.5, 0),
// }

class Text2D extends THREE.Object3D {

  constructor(text = '', options = {}) {
    super();

    this._font = options.font || '30px Arial';
    this._fillStyle = options.fillStyle || '#FFFFFF';

    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');

    // this._textAlign = options.align || "center"
    // this.anchor = Label.fontAlignAnchor[ this._textAlign ]
    this.text = text;

    this.texture = new THREE.Texture(this._canvas);
    this.texture.needsUpdate = true;

    if (options.antialias === false) {
      this.texture.magFilter = THREE.NearestFilter
      this.texture.minFilter = THREE.LinearMipMapLinearFilter
    }

    this.material = new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide });
    this.material.transparent = true;

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(this._canvas.width, this._canvas.height), this.material);

    window.text = this

    this.add(this.mesh)
  }

  get text() {
    return this._text;
  }

  set text(value) {
    if (this._text !== value) {
      this._text = value;
      this.updateText();
    }
  }

  get font() {
    return this._font;
  }

  set font(value) {
    if (this._font !== value) {
      this._font = value;
      this.updateText();
    }
  }

  get fillStyle() {
    return this._fillStyle;
  }

  set fillStyle(value) {
    if (this._fillStyle !== value) {
      this._fillStyle = value;
      this.updateText();
    }
  }

  updateText() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.font = this._font;

    var textWidth = this._ctx.measureText(this._text).width;
    this._canvas.width = Math.ceil(textWidth);
    this._canvas.height = getFontHeight(this._font);

    this.width = this._canvas.width
    this.height = this._canvas.height

    this._ctx.font = this._font;

    this._ctx.fillStyle = this._fillStyle;
    this._ctx.textAlign = 'left';
    this._ctx.textBaseline = 'top';

    let str = this._text;
    if (str === '' || str === null) {
      str = ' ';
    }
    this._ctx.fillText(str, 0, 0);

    if (this.texture) {
      this.remove(this.mesh)

      // Insane memory leak here

      this.texture = new THREE.Texture(this._canvas);
      this.texture.needsUpdate = true;

      this.material = new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide });
      this.material.transparent = true

      this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(this._canvas.width, this._canvas.height), this.material);
      this.add(this.mesh)
    }

  }

}

var fontHeightCache = {}
function getFontHeight (fontStyle) {
  var result = fontHeightCache[fontStyle];

  if (!result)
  {
    var body = document.getElementsByTagName('body')[0];
    var dummy = document.createElement('div');

    var dummyText = document.createTextNode('MÉq');
    dummy.appendChild(dummyText);
    dummy.setAttribute('style', 'font:' + fontStyle + ';position:absolute;top:0;left:0');
    body.appendChild(dummy);
    result = dummy.offsetHeight;

    fontHeightCache[fontStyle] = result;
    body.removeChild(dummy);
  }

  return result;
}

function isPowerOfTwo (x) {
  var n = parseInt(x)
  while (((x % 2) == 0) && x > 1) {
    x = x/2
  }
  return x == 1 && n !== 1
}

export default Text2D
