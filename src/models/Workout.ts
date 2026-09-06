import mongoose, { Schema } from "mongoose";

interface IWorkoutSet {
  pushId: string;
  reps: number;
  weight: number;
  unit: string;
  rir: number;
  pb: boolean;
  estimatedOneRepMaxKg: number;
}

const setSchema = new Schema<IWorkoutSet>({
  pushId: String,
  reps: Number,
  weight: Number,
  unit: String,
  rir: Number,
  pb: Boolean,
  estimatedOneRepMaxKg: Number,
});

interface IExercise {
  exercise: string;
  masterId: string;
  equipment: string;
  mainTargets: string[];
  completedSets: number;
  volumeKg: number;
  sets: IWorkoutSet[];
}

const exerciseSchema = new Schema<IExercise>(
  {
    exercise: String,
    masterId: String,
    equipment: String,
    mainTargets: [String],
    completedSets: Number,
    volumeKg: Number,
    sets: [setSchema],
  },
  { timestamps: true },
);

interface IWorkout {
  pushId: string;
  name: string;
  startTime: Date;
  endTime: Date;
  completedSets: number;
  volumeKg: number;
  exercises: IExercise[];
  muscles: string[];
}

const workoutSchema = new Schema<IWorkout>(
  {
    pushId: String,
    name: String,
    startTime: Date,
    endTime: Date,
    completedSets: Number,
    volumeKg: Number,
    exercises: [exerciseSchema],
    muscles: [String],
  },
  { timestamps: true },
);

export default mongoose.models.Workout ||
  mongoose.model<IWorkout>("Workout", workoutSchema);
