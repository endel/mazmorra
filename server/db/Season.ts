import { mongoose } from "@colyseus/social";

const Schema = mongoose.Schema

/**
 * Hero
 */
export interface DBSeason extends mongoose.Document {
  seed: string;
  until: number;
};

const SeasonSchema = new Schema<DBSeason>({
  seed: String,
  until: Number
});

SeasonSchema.index({ until: -1 });

export const Season = mongoose.model<DBSeason>('Season', SeasonSchema);
