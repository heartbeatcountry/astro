import { Schema, model, ObjectId } from "mongoose";
import { contraintes } from "../consts.mjs";

export const Appreciation = new Schema({
	note: {
		type: Number,
		min: 1,
		max: 5,
	},

	danse: {
		type: ObjectId,
		ref: "Danse",
	},
});

export default Appreciation;
