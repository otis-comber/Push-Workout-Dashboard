import { dbConnect } from "@/lib/db/connect";
import Workout from "@/models/Workout";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

function allowedMethods(
  methods: string[],
  handler: NextApiHandler,
): NextApiHandler {
  return async (req, res) => {
    if (!methods.includes(req.method ?? "")) {
      res.setHeader("Allow", methods);
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
    return handler(req, res);
  };
}

async function workoutHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const result = await Workout.find();
    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to load data" });
  }
}

export default allowedMethods(["GET"], workoutHandler);
