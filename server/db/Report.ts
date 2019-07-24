import { mongoose } from "@colyseus/social";

/**
 * Hero
 */
export interface DBReport extends mongoose.Document {
  userId: string,
  heroId: string,
  message: number,
  stack: number,
  debug: any,
  timestamp: number
};

export const Report = mongoose.model<DBReport>('Report', new mongoose.Schema<DBReport>({
  userId: String,
  heroId: String,
  message: String,
  stack: String,
  debug: mongoose.Schema.Types.Mixed,
  timestamp: Number,
}, {
  versionKey: false
}));
