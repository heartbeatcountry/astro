import { Schema, model, ObjectId } from "mongoose";
import { contraintes } from "../consts.mjs";

export const Appreciation = new Schema({
	note: {
		type: Number,
		min: 1,
		max: 5,
		required: true,
	},

	danse: {
		type: ObjectId,
		index: true,
		ref: "Danse",
		required: true,
	},

	usager: {
		type: ObjectId,
		index: true,
		ref: "Usager",
		required: true,
	},
});

Appreciation.index({ danse: 1, usager: 1 }, { unique: true });

export default Appreciation;
