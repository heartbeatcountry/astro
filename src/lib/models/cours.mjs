import { Schema, model, ObjectId } from "mongoose";
import { contraintes } from "../consts.mjs";


export const Cours = new Schema({

	niveau:{
		type:String,
		enum: ['Initiation', 'Débutant','Novice','Intermédiaire','Avancé'],
		required: true,
	},

	date:{
		type:Date,
		required: true,
	},

	lieu:{
		type:String,
		//type: [ObjectId],
		//ref: 'lieu',
		required: true,
		unique: true,
	}
});

export default Cours;
