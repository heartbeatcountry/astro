import { Schema, model, ObjectId } from "mongoose";
import { contraintes } from "../consts.mjs";

/**
 * Expression rationnelle à utiliser pour valider les adresses courriel
 */
const regexCourriel = contraintes.usager.courriel.regex;


export const Usager = new Schema({
	prenom: {
		type: String,
		trim: true,
		required: true,
		minLength: contraintes.usager.nom.longueurMin,
		maxLength: contraintes.usager.nom.longueurMax,
	},
	nom: {
		type: String,
		trim: true,
		required: true,
		minLength: contraintes.usager.nom.longueurMin,
		maxLength: contraintes.usager.nom.longueurMax,
	},
	courriel: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: "Le champ `courriel` est requis",
		validate: [regexCourriel.test, "Le champ `courriel` est invalide"],
	},
	mdp: {
		type: String,
		trim: true,
		required: true,
		minLength: contraintes.usager.mdp.longueurMin,
		maxLength: contraintes.usager.mdp.longueurMax,
	},
	telephone: {
		type: String,
		trim: true,
		required: true,
		validate: [contraintes.usager.telephone.regex.test, "Le champ `téléphone` est invalide.  Veuillez entrer selon le format 555-555-5555"]
	},
	estAdmin: {
		type: Boolean,
		default: false,
	},
	estValide: {
		type: Boolean,
		default: false,
	},
	dansesSouhaitees: [{
		type: ObjectId,
		ref: 'Danse',
		unique: true,
	}]
});

export default Usager;
