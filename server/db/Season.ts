import { mongoose } from "@colyseus/social";

const Schema = mongoose.Schema

/**
 * Hero
 */
export interface DBSeason extends mongoose.Document {
  seed: string;
  until: number;
};

export const Season = mongoose.model<DBSeason>('Season', new Schema<DBSeason>({
  seed: String,
  until: Number
}));
