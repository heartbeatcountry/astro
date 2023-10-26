import { Schema, model, ObjectId } from "mongoose";
import { contraintes } from "../consts.mjs";

const cnt = contraintes.usager;

export const Usager = new Schema({
	prenom: {
		type: String,
		trim: true,
		required: [true, "Le prénom est requis"],
		null: [false, "Le prénom ne doit pas être nul"],
		minLength: [cnt.nom.longueurMin, `Le prénom doit contenir entre ${cnt.nom.longueurMin} et ${cnt.nom.longueurMax} caractères`],
		maxLength: [cnt.nom.longueurMax, `Le prénom doit contenir entre ${cnt.nom.longueurMin} et ${cnt.nom.longueurMax} caractères`],
	},
	nom: {
		type: String,
		trim: true,
		required: [true, "Le nom est requis"],
		null: [false, "Le nom ne doit pas être nul"],
		minLength: [cnt.nom.longueurMin, `Le nom doit contenir entre ${cnt.nom.longueurMin} et ${cnt.nom.longueurMax} caractères`],
		maxLength: [cnt.nom.longueurMax, `Le nom doit contenir entre ${cnt.nom.longueurMin} et ${cnt.nom.longueurMax} caractères`],
	},
	courriel: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: [true, "L'adresse courriel est requise"],
		null: [false, "L'adresse courriel ne doit pas être nulle"],
		match: [cnt.courriel.regex, "L'adresse courriel est invalide"],
	},
	mdp: {
		type: String,
		trim: true,
		required: [true, "Le mot de passe est requis"],
		null: [false, "Le mot de passe ne doit pas être nul"],
		minLength: [cnt.mdp.longueurMin, `Le mot de passe doit contenir entre ${cnt.mdp.longueurMin} et ${cnt.mdp.longueurMax} caractères`],
		maxLength: [cnt.mdp.longueurMax, `Le mot de passe doit contenir entre ${cnt.mdp.longueurMin} et ${cnt.mdp.longueurMax} caractères`],
	},
	telephone: {
		type: String,
		trim: true,
		required: [true, "Le numéro de téléphone est requis"],
		null: [false, "Le numéro de téléphone ne doit pas être nul"],
		match: [cnt.telephone.regex, "Le numéro de téléphone est invalide. Veuillez entrer selon le format 555-555-5555"]
	},
	estAdmin: {
		type: Boolean,
		default: false,
		required: false,
		null: [false, "Le statut d'administrateur ne doit pas être nul"],
	},
	estValide: {
		type: Boolean,
		default: false,
		required: false,
		null: [false, "Le statut de validation ne doit pas être nul"],
	},
	dansesSouhaitees: {
		type: [ObjectId],
		ref: 'Danse',
		required: false,
		null: [false, "Les danses souhaitées ne doivent pas être nulles"],
	}
}, {
	virtuals: {
		nomAffichage: { get: () => `${this.prenom} ${this.nom}` },
	},
});

export default Usager;
