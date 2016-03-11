import CharacterItems from './CharacterItems'
import SlotStrip from './SlotStrip'

export default class Inventory extends THREE.Object3D {

  constructor () {
    super()

    this.characterItems = new CharacterItems()
    this.position.y += this.characterItems.height / 3

    this.exchangeSymbol = ResourceManager.getHUDElement('hud-exchange-icon')
    this.exchangeSymbol.position.y = -this.characterItems.height/2 - (this.exchangeSymbol.height + HUD_SCALE)
    this.add(this.exchangeSymbol)

    this.slots = new SlotStrip()
    this.slots.numSlots = 4
    this.slots.position.y = this.exchangeSymbol.position.y - this.exchangeSymbol.height - (this.slots.height/2) - HUD_SCALE
    this.slots.position.x = -this.slots.width/2

    this.add(this.characterItems)
    this.add(this.slots)
  }



}
