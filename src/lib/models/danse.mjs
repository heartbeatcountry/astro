import { Schema, model, ObjectId } from "mongoose";
import { contraintes } from "../consts.mjs";
import { Lien } from "./schemas/lien.mjs";
import { NIVEAU, Niveau } from "../enums.mjs";


export const Danse = new Schema({
	titre: {
		type: String,
		trim: true,
		required: true,
		minLength: contraintes.danse.titre.longueurMin,
		maxLength: contraintes.danse.titre.longueurMax,
	},
	description: {
		type: String,
		trim: true,
		required: false,
		minLength: contraintes.danse.description.longueurMin,
		maxLength: contraintes.danse.description.longueurMax,
	},
	nbComptes: {
		type: Number,
		required: true,
		min: contraintes.danse.comptes.min,
		max: contraintes.danse.comptes.max,
	},
	nbMurs: {
		type: Number,
		required: true,
		min: contraintes.danse.murs.min,
		max: contraintes.danse.murs.max,
	},
	coupDeCoeur: {
		type: Boolean,
		default: false,
	},
	video: Lien,
	feuilleDePas: Lien,
	detailsAuteur: {
		type: String,
		trim: true,
		required: false,
		minLength: contraintes.danse.auteur.longueurMin,
		maxLength: contraintes.danse.auteur.longueurMax,
	},
	detailsNiveau: {
		type: String,
		trim: true,
		required: false,
		minLength: contraintes.danse.niveau.longueurMin,
		maxLength: contraintes.danse.niveau.longueurMax,
	},
	detailsTag: {
		type: String,
		trim: true,
		required: false,
		minLength: contraintes.danse.tag.longueurMin,
		maxLength: contraintes.danse.tag.longueurMax,
	},
	detailsMusique: {
		type: String,
		trim: true,
		required: false,
		minLength: contraintes.danse.musique.longueurMin,
		maxLength: contraintes.danse.musique.longueurMax,
	},
	niveau: {
		type: Number,
		enum: Object.values(NIVEAU),
	},
});

export default Danse;
