import { mongoose } from "@colyseus/social";

/**
 * Hero
 */
export interface DBQuest extends mongoose.Document {
  name: string,
  lvl: number,
  progress: number,
  text: string,
  timestamp: number
};

export const Quest = mongoose.model<DBQuest>('Quest', new mongoose.Schema<DBQuest>({
  name: String,
  lvl: Number,
  progress: Number,
  text: String,
  timestamp: Number
}, {
  versionKey: false
}));
