import { ObjectId, mongoose } from "@colyseus/social";
import { Attribute, StatsModifiers } from "../entities/Unit";

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
}

const Item = new mongoose.Schema<DBItem>({
  type: String,
  modifiers: [AttributeModifier]
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

  name: string;
  klass: number;
  lvl: number;

  hair: number;
  hairColor: number;
  eye: number;
  body: number;

  currentProgress: number;
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

  inventory: DBItem[];
  equipedItems: DBItem[];
  quickInventory: DBItem[];

  skills: any;
};

export const ATTRIBUTE_BASE_VALUE = 5;
export const Hero = mongoose.model<DBHero>('Hero', new Schema<DBHero>({
  userId: Schema.Types.ObjectId,

  name: String,
  klass: { type: Number, default: 0 },
  lvl: { type: Number, default: 1 },

  hair: { type: Number, default: 0 },
  hairColor: { type: Number, default: 0 },
  eye: { type: Number, default: 0 },
  body: { type: Number, default: 0 },

  // how deep is the hero in the campaign?
  currentProgress: { type: Number, default: 2 },
  latestProgress: { type: Number, default: 2 },

  alive: { type: Boolean, default: true },

  // store only current values
  // max values are computed by class / lvl + item modifiers
  hp: Number,
  mp: Number,
  xp: Number,

  gold: { type: Number, default: 0 },
  diamond: { type: Number, default: 0 },

  /**
   * Static values based on Hero "class"
   */
  primaryAttribute: String,
  baseArmor: Number,

  strength: { type: Number, default: ATTRIBUTE_BASE_VALUE },
  agility: { type: Number, default: ATTRIBUTE_BASE_VALUE },
  intelligence: { type: Number, default: ATTRIBUTE_BASE_VALUE },

  inventory: { type: [Item], default: [] },
  equipedItems: { type: [Item], default: [] },
  quickInventory: { type: [Item], default: [] },

  skills: [ Skill ]
}));
