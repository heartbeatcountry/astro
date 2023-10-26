import { Schema, model, ObjectId } from "mongoose";
import { contraintes } from "../consts.mjs";
import { NIVEAU } from "../enums.mjs";
import { genererIdentifiantUnique } from "../cryptographie.mjs";

const cnt = contraintes.danse;


export const Danse = new Schema({
	titre: {
		type: String,
		trim: true,
		null: [false, "Le titre de la danse ne doit pas être nul"],
		required: [true, "Le titre de la danse est requis"],
		minLength: [cnt.titre.longueurMin, `Le titre doit avoir entre ${cnt.titre.longueurMin} et ${cnt.titre.longueurMax} caractères`],
		maxLength: [cnt.titre.longueurMax, `Le titre doit avoir entre ${cnt.titre.longueurMin} et ${cnt.titre.longueurMax} caractères`],
	},
	choregraphe: {
		type: String,
		trim: true,
		null: [false, "Le prénom et nom du chorégraphe ne doit pas être nul"],
		required: false,
		minLength: [cnt.choregraphe.longueurMin, `Le chorégraphe doit avoir entre ${cnt.choregraphe.longueurMin} et ${cnt.choregraphe.longueurMax} caractères`],
		maxLength: [cnt.choregraphe.longueurMax, `Le chorégraphe doit avoir entre ${cnt.choregraphe.longueurMin} et ${cnt.choregraphe.longueurMax} caractères`],
	},
	musique: {
		type: String,
		trim: true,
		null: [false, "La musique ne doit pas être nulle"],
		required: [true, "La musique est requise"],
		minLength: [cnt.musique.longueurMin, `La musique doit avoir entre ${cnt.musique.longueurMin} et ${cnt.musique.longueurMax} caractères`],
		maxLength: [cnt.musique.longueurMax, `La musique doit avoir entre ${cnt.musique.longueurMin} et ${cnt.musique.longueurMax} caractères`],
	},
	niveau: {
		type: Number,
		enum: Object.values(NIVEAU),
		required: [true, "Le niveau est requis"],
	},
	detailsTag: {
		type: String,
		trim: true,
		required: false,
		null: [false, "Le tag ne doit pas être nul"],
		minLength: [cnt.detailsTag.longueurMin, `Le tag doit avoir entre ${cnt.detailsTag.longueurMin} et ${cnt.detailsTag.longueurMax} caractères`],
		maxLength: [cnt.detailsTag.longueurMax, `Le tag doit avoir entre ${cnt.detailsTag.longueurMin} et ${cnt.detailsTag.longueurMax} caractères`],
	},
	lienFeuille: {
		type: String,
		trim: true,
		required: false,
		null: [false, "Le lien de la feuille ne doit pas être nul"],
	},
	lienVideoDanse: {
		type: String,
		trim: true,
		required: false,
		null: [false, "Le lien de la vidéo de danse ne doit pas être nul"],
	},
	lienVideoMusique: {
		type: String,
		trim: true,
		required: false,
		null: [false, "Le lien de la vidéo de la musique ne doit pas être nul"],
	},
	lienVideoAcademie: {
		type: String,
		trim: true,
		required: false,
		null: [false, "Le lien de la vidéo de l'Académie ne doit pas être nul"],
	},
	nbComptes: {
		type: Number,
		required: false,
		null: [false, "Le nombre de comptes ne doit pas être nul"],
		min: [cnt.nbComptes.min, `Le nombre de comptes doit être entre ${cnt.nbComptes.min} et ${cnt.nbComptes.max}`],
		max: [cnt.nbComptes.max, `Le nombre de comptes doit être entre ${cnt.nbComptes.min} et ${cnt.nbComptes.max}`],
	},
	nbMurs: {
		type: Number,
		required: false,
		null: [false, "Le nombre de murs ne doit pas être nul"],
		min: [cnt.nbMurs.min, `Le nombre de murs doit être entre ${cnt.nbMurs.min} et ${cnt.nbMurs.max}`],
		max: [cnt.nbMurs.max, `Le nombre de murs doit être entre ${cnt.nbMurs.min} et ${cnt.nbMurs.max}`],
	},
	estCoupDeCoeur: {
		type: Boolean,
		default: false,
		required: false,
		null: [false, "Le coup de coeur ne doit pas être nul"],
	},
	identifiantUnique: {
		type: String,
		default: genererIdentifiantUnique,
		set: genererIdentifiantUnique,
		required: [true, "L'identifiant unique est requis"],
		unique: true,
		immutable: [true, "Impossible de modifier l'identifiant unique de la danse"],
		minLength: [cnt.titre.longueurMin, `L'identifiant unique doit avoir entre ${cnt.titre.longueurMin} et ${cnt.titre.longueurMax} caractères`],
		maxLength: [cnt.titre.longueurMax, `L'identifiant unique doit avoir entre ${cnt.titre.longueurMin} et ${cnt.titre.longueurMax} caractères`],
	},
}, {
	methods: {
		/**
		 * Requête qui permet d'obtenir la moyenne des appréciations
		 */
		obtenirNoteMoyenne() {
			return model("Appreciation")
				.aggregate()
				.match({ danse: this._id })
				.group({ _id: null, moyenne: { $avg: "$note" } })
				.project({ _id: 0, moyenne: { $round: ["$moyenne", 1] } });
		}
	},
});

export default Danse;
