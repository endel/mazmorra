import { ObjectId, mongoose } from "@colyseus/social";

const Schema = mongoose.Schema

export interface DBItem {
  // item properties
}

const Item = new mongoose.Schema<DBItem>({
  // item properties
}, {
  _id: false
});

export interface DBSkill {
  // skill propertyes
}

const Skill = new mongoose.Schema<DBItem>({
  // skill properties
}, {
  _id: false
});

export interface DBHero extends mongoose.Document {
  userId: ObjectId;

  name: string;
  klass: number;
  lvl: number;

  hair: number;
  hairColor: number;
  eye: number;
  body: number;

  progress: number;
  alive: boolean;

  hp: number;
  mp: number;
  xp: number;

  gold: number;
  diamond: number;

  strenght: number;
  dexterity: number;
  intelligence: number;
  vitality: number;

  inventory: any[];
  equipedItems: any[];
  quickInventory: any[];

  skills: any;
}

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
  progress: { type: Number, default: 1 },
  alive: { type: Boolean, default: true },

  // store only current values
  // max values are computed by class / lvl + item modifiers
  hp: Number,
  mp: Number,
  xp: Number,

  gold: { type: Number, default: 0 },
  diamond: { type: Number, default: 0 },

  strenght: Number,
  dexterity: Number,
  intelligence: Number,
  vitality: Number,

  inventory: { type: [Item], default: [] },
  equipedItems: { type: [Item], default: [] },
  quickInventory: { type: [Item], default: [] },

  skills: [ Skill ]
}));
