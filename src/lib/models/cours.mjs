import Mongoose, { Schema, model, ObjectId } from "mongoose";
import { contraintes } from "../consts.mjs";
import { NIVEAU, NIVEAU_STR } from "../enums.mjs";

export const CoursSchema = new Schema(
	{
		niveau: {
			type: Number,
			enum: [
				Object.values(NIVEAU),
				`Le niveau minimum est ${NIVEAU_STR[1]}`,
			],
			min: [1, `Le niveau minimum est ${NIVEAU_STR[1]}`],
			required: [true, "Le niveau est requis"],
			null: [false, "Le niveau ne doit pas être nul"],
		},

		date: {
			type: Date,
			required: [true, "La date d'enseignement est requise"],
			null: [false, "La date d'enseignement ne doit pas être nulle"],
			validate: [
				{
					validator(date) {
						return !this.$isNew || date > Date.now();
					},
					message: "La date d'enseignement doit être dans le futur",
				},
				{
					validator(date) {
						return date.getHours() > 0;
					},
					message: "L'heure d'enseignement doit être définie",
				},
			],
		},

		lieu: {
			type: String,
			//type: [ObjectId],
			//ref: 'Lieu',
			required: [true, "Le lieu d'enseignement est requis"],
			null: [false, "Le lieu d'enseignement ne doit pas être nul"],
		},

		danses: {
			type: [ObjectId],
			ref: "Danse",
			required: [true, "Au moins une danse est requise"],
			null: [false, "La liste des danses ne doit pas être nulle"],
			validate: [
				{
					validator(lstDanses) {
						return lstDanses.length > 0;
					},
					message: "Au moins une danse est requise",
				},
				{
					async validator(lstDanses) {
						for (const id of lstDanses) {
							if (!(await model("Danse").exists({ _id: id }))) {
								return false;
							}
						}
						return true;
					},
					message: () =>
						`La liste des danses contient une danse qui n'existe pas`,
				},
			],
		},
	},
	{
		timestamps: true,
	}
);

export const Cours = Mongoose.models.Cours ?? model("Cours", CoursSchema);
export default Cours;
