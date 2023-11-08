import { Schema, model, ObjectId } from "mongoose";
import { contraintes } from "../consts.mjs";
const cnt = contraintes.appreciation;

export const Appreciation = new Schema({
	note: {
		type: Number,
		min: [cnt.note.min, `La note minimale est de ${cnt.note.min}`],
		max: [cnt.note.max, `La note maximale est de ${cnt.note.max}`],
		null: [false, "La note ne doit pas être nulle"],
		required: [true, "La note est requise"],
	},

	danse: {
		type: ObjectId,
		index: true,
		ref: "Danse",
		null: [false, "La danse ne doit pas être nulle"],
		required: [true, "La danse est requise"],
		validate: [
			{
				async validator(id) {
					return await model("Danse").exists({ _id: id });
				},
				message: id => `La danse ${id} n'existe pas`,
			}
		],
	},

	usager: {
		type: ObjectId,
		index: true,
		ref: "Usager",
		null: [false, "L'usager ne doit pas être nul"],
		required: [true, "L'usager est requis"],
		validate: [
			{
				async validator(id) {
					return await model("Usager").exists({ _id: id });
				},
				message: id => `L'usager ${id} n'existe pas`,
			}
		],
	},
}, {
	timestamps: true,
});

Appreciation.index({ danse: 1, usager: 1 }, { unique: true });

/**
 * Écouteur pour recalculer la note moyenne d'une danse lors de l'ajout ou de
 * la modification d'une appréciation.
 */
async function recalculerMoyenne() {
	const nouvMoyenne = (await model("Appreciation")
		.aggregate()
		.match({ danse: this._conditions.danse })
		.group({ _id: null, moyenne: { $avg: "$note" } })
		.project({ _id: 0, moyenne: { $round: ["$moyenne", 1] } }))[0].moyenne;

	await model("Danse").updateOne({
		_id: this._conditions.danse
	}, {
		noteMoyenne: nouvMoyenne
	});
}
Appreciation.post("updateOne", recalculerMoyenne);
//Appreciation.post("save", recalculerMoyenne);

export default Appreciation;
