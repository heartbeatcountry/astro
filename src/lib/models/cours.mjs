import { Schema, model, ObjectId } from "mongoose";
import { contraintes } from "../consts.mjs";
import { NIVEAU } from "../enums.mjs";



export const Cours = new Schema({
	niveau: {
		type: Number,
		enum: Object.values(NIVEAU),
		required: true,
	},

	date: {
		type: Date,
		required: true,
	},

	lieu: {
		type: String,
		//type: [ObjectId],
		//ref: 'Lieu',
		required: true,
	},

	danses: [
		{
			type: ObjectId,
			ref: "Danse",
		},
	],
});

export default Cours;
