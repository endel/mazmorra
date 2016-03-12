import CharacterItems from './CharacterItems'
import SlotStrip from './SlotStrip'

export default class Inventory extends THREE.Object3D {

  constructor () {
    super()

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

}
