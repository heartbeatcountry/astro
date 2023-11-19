import Mongoose, { Schema, model, ObjectId } from "mongoose";
import { contraintes } from "../consts.mjs";
import { NIVEAU } from "../enums.mjs";



export const CoursSchema = new Schema({
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
}, {
	timestamps: true,
});

export const Cours = Mongoose.models.Cours ?? model("Cours", CoursSchema);
export default Cours;
