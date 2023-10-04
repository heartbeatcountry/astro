import { Schema, model, ObjectId } from "mongoose";
import { contraintes } from "../consts.mjs";
import { NIVEAU } from "../enums.mjs";


export const Danse = new Schema({
	titre: {
		type: String,
		trim: true,
		required: true,
		minLength: contraintes.danse.titre.longueurMin,
		maxLength: contraintes.danse.titre.longueurMax,
	},
	choregraphe: {
		type: String,
		trim: true,
		required:
			"Le prénom et nom du chorégraphe est requis.  Sinon indiquer inconnu.",
		minLength: contraintes.danse.choregraphe.longueurMin,
		maxLength: contraintes.danse.choregraphe.longueurMax,
	},
	musique: {
		type: String,
		trim: true,
		required: true,
		minLength: contraintes.danse.musique.longueurMin,
		maxLength: contraintes.danse.musique.longueurMax,
	},
	niveau: {
		type: Number,
		enum: Object.values(NIVEAU),
		required: true,
	},
	detailsTag: {
		type: String,
		trim: true,
		minLength: contraintes.danse.detailsTag.longueurMin,
		maxLength: contraintes.danse.detailsTag.longueurMax,
	},
	lienFeuille: {
		type: String,
		trim: true,
	},
	lienVideoDanse: {
		type: String,
		trim: true,
	},
	lienVideoMusique: {
		type: String,
		trim: true,
	},
	lienVideoAcademie: {
		type: String,
		trim: true,
	},
	nbComptes: {
		type: Number,
		min: contraintes.danse.nbComptes.min,
		max: contraintes.danse.nbComptes.max,
	},
	nbMurs: {
		type: Number,
		min: contraintes.danse.nbMurs.min,
		max: contraintes.danse.nbMurs.max,
	},
	estCoupDeCoeur: {
		type: Boolean,
		default: false,
	},

});

export default Danse;
