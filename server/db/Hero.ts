import helpers from "../../shared/helpers";
import { ObjectId, mongoose } from "@colyseus/social";
import { Attribute, StatsModifiers } from "../entities/Unit";
import { POTION_1_MODIFIER } from "../entities/items/consumable/Potion";
import { RoomType } from "../rooms/states/DungeonState";

const Schema = mongoose.Schema


/**
 * Attribute modifier
 */
export interface DBAttributeModifier {
  attr: keyof StatsModifiers,
  modifier: number
}

const AttributeModifier = new mongoose.Schema<DBAttributeModifier>({
  attr: String,
  modifier: Number
}, { _id: false });

/**
 * Item
 */
export interface DBItem {
  type: string,
  modifiers?: DBAttributeModifier[]
  qty?: number, // for consumable items
  damageAttribute?: Attribute,
  manaCost?: number,
  isRare?: boolean,
  isMagical?: boolean,
  premium?: boolean, // exchange for diamonds?
  progressRequired?: number;
}

const Item = new mongoose.Schema<DBItem>({
  type: String,
  modifiers: [AttributeModifier],

  // for consumable items
  qty: Number,

  // for weapons
  isRare: Boolean,
  isMagical: Boolean,
  damageAttribute: String,
  manaCost: Number,
  progressRequired: Number,
}, { _id: false });

/**
 * Skill
 */
export interface DBSkill {
  // skill propertyes
}

const Skill = new mongoose.Schema<DBItem>({
  // skill properties
}, { _id: false });

/**
 * Hero
 */
export interface DBHero extends mongoose.Document {
  userId: ObjectId;
  online: boolean;

  name: string;
  klass: number;
  lvl: number;

  inventoryCapacity: number;

  kills: number;
  deaths: number;

  hair: number;
  hairColor: number;
  eye: number;
  body: number;

  currentRoom?: RoomType;
  currentProgress?: number;

  latestProgress: number;
  alive: boolean;

  hp: number;
  mp: number;
  xp: number;

  gold: number;
  diamond: number;

  primaryAttribute: Attribute;
  baseArmor: number;

  strength: number;
  agility: number;
  intelligence: number;
  pointsToDistribute: number;

  inventory: DBItem[];
  equipedItems: DBItem[];

  checkPoints: number[];

  skills: any;
};

export const ATTRIBUTE_BASE_VALUE = 5;
export const Hero = mongoose.model<DBHero>('Hero', new Schema<DBHero>({
  userId: Schema.Types.ObjectId,
  online: { type: Boolean, default: false },

  name: String,
  klass: { type: Number, default: 0 },
  lvl: { type: Number, default: 1 },

  inventoryCapacity: { type: Number, default: 15 },

  kills: { type: Number, default: 0 },
  deaths: { type: Number, default: 0 },

  hair: { type: Number, default: 0 },
  hairColor: { type: Number, default: 0 },
  eye: { type: Number, default: 0 },
  body: { type: Number, default: 0 },

  // how deep is the hero in the campaign?
  currentRoom: { type: String, default: "dungeon" },
  currentProgress: { type: Number, default: 1 },
  latestProgress: { type: Number, default: 1 },

  alive: { type: Boolean, default: true },

  // store only current values
  // max values are computed by class / lvl + item modifiers
  hp: Number,
  mp: Number,
  xp: Number,

  gold: { type: Number, default: 50 },
  diamond: { type: Number, default: 0 },

  /**
   * Static values based on Hero "class"
   */
  primaryAttribute: String,
  baseArmor: Number,

  strength: { type: Number, default: ATTRIBUTE_BASE_VALUE },
  agility: { type: Number, default: ATTRIBUTE_BASE_VALUE },
  intelligence: { type: Number, default: ATTRIBUTE_BASE_VALUE },
  pointsToDistribute: { type: Number, default: 3 },

  inventory: { type: [Item], default: [
    { type: helpers.ENTITIES.HP_POTION_1, qty: 2, modifiers: [{ attr: "hp", modifier: POTION_1_MODIFIER }] },
    { type: helpers.ENTITIES.MP_POTION_1, qty: 2, modifiers: [{ attr: "mp", modifier: POTION_1_MODIFIER }] },
    { type: helpers.ENTITIES.SCROLL },
  ] },
  equipedItems: { type: [Item], default: [] },

  checkPoints: { type: [Number], default: [1] },

  skills: [ Skill ]
}));
