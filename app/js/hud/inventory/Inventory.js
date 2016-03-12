import CharacterItems from './CharacterItems'
import SlotStrip from './SlotStrip'
import ItemSlot from './ItemSlot'

export default class Inventory extends THREE.Object3D {

  constructor () {
    super()

    this.isOpen = false

    this.characterItems = new CharacterItems()
    this.slots = new SlotStrip({ slots: 4 })
    this.exchangeSlots = new SlotStrip({ slots: 1, allowRemove: true })

    this.characterItems.position.x -= this.characterItems.width/2 + this.slots.singleSlotSize/1.5
    this.slots.position.x = this.characterItems.position.x + (this.characterItems.width/2 + this.slots.singleSlotSize / 2 + HUD_SCALE * 2)
    this.slots.position.y = this.slots.height

    this.exchangeSlots.position.x = this.characterItems.position.x + (this.characterItems.width/2 + this.slots.singleSlotSize / 2 + HUD_SCALE * 2) + (this.exchangeSlots.width / 2)
    this.exchangeSlots.position.y = -this.exchangeSlots.height

    this.exchangeSymbol = ResourceManager.getHUDElement('hud-exchange-icon')
    this.exchangeSymbol.position.x = this.slots.position.x + this.slots.width/2 - this.exchangeSymbol.width/2

    this.add(this.characterItems)
    this.add(this.slots)
    this.add(this.exchangeSymbol)
    this.add(this.exchangeSlots)

    this.width = this.characterItems.width + this.slots.position.x + this.slots.width
    this.height = this.characterItems.height
  }

  toggleOpen () {
    this.isOpen = !this.isOpen

    let targetOpacity = ((this.isOpen) ? ItemSlot.DEFAULT_OPACITY : 0)
      , scaleFrom = ((this.isOpen) ? 0.5 : 1)
      , scaleTo = ((this.isOpen) ? 1 : 0.5)

    this.scale.set(scaleFrom, scaleFrom, scaleFrom)
    if (this.isOpen) this.visible = true

    let elementsToFade = this.characterItems.children
                          .concat(this.slots.children)
                          .concat(this.exchangeSlots.children)
                          .concat(this.exchangeSymbol)

    elementsToFade.map((el, i) => {
      tweener.remove(el.material)
      tweener.add(el.material)
        .wait(i * 15)
        .to({ opacity: targetOpacity }, 500, Tweener.ease.quintOut)
    })

    tweener.remove(this.scale)
    tweener.add(this.scale).to({ x: scaleTo, y: scaleTo, z: scaleTo }, 500, Tweener.ease.quintOut).then(() => {
      if (!this.isOpen) this.visible = false
    })
  }

}
