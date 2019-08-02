import helpers from "../../shared/helpers";
import { ObjectId, mongoose } from "@colyseus/social";
import { Attribute, StatsModifiers } from "../entities/Unit";
import { POTION_1_MODIFIER } from "../entities/items/consumable/Potion";
import { RoomSeedType } from "../rooms/states/DungeonState";

const Schema = mongoose.Schema
/**
 * Hero
 */
export interface DBTrueHellResult extends mongoose.Document {
  level: number;
  heroes: ObjectId[];
  releaseVersion: string;
};


export const TrueHellResult = mongoose.model<DBTrueHellResult>('TrueHellResult', new Schema<DBTrueHellResult>({
  level: Number,
  heroes: [Schema.Types.ObjectId],
  releaseVersion: String
}));
