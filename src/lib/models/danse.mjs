import Mongoose, { Schema, model, ObjectId } from "mongoose";
import { contraintes } from "../consts.mjs";
import { NIVEAU, NIVEAU_STR } from "../enums.mjs";

const cnt = contraintes.danse;

/**
 * Permet de racourcir un lien YouTube à son identifiant unique
 *
 * @param {string} lien lien à racourcir
 * @returns {string} l'identifiant unique de la vidéo
 */
const racourcirLienYoutube = (lien) =>
	lien.match(/(?<=[&?]v=)[^&#/?]+/)?.[0] ??
	lien.match(/(?<=youtu.be\/)[^&#/?]+/)?.[0] ??
	lien;

/**
 * Permet de valider si la vidéo peut être jouée directement sur le site
 *
 * @param {string} lien la vidéo à valider
 * @returns {boolean} vrai si la vidéo est jouable, faux sinon
 */
const verifierVideoJouable = async (lien) => {
	try {
		return !(
			await (
				await fetch(
					`https://www.youtube.com/embed/${racourcirLienYoutube(
						lien
					)}`
				)
			).text()
		).includes("UNPLAYABLE");
	} catch {
		return false;
	}
};

export const DanseSchema = new Schema(
	{
		titre: {
			type: String,
			trim: true,
			null: [false, "Le titre de la danse ne doit pas être nul"],
			required: [true, "Le titre de la danse est requis"],
			minLength: [
				cnt.titre.longueurMin,
				`Le titre doit avoir entre ${cnt.titre.longueurMin} et ${cnt.titre.longueurMax} caractères`,
			],
			maxLength: [
				cnt.titre.longueurMax,
				`Le titre doit avoir entre ${cnt.titre.longueurMin} et ${cnt.titre.longueurMax} caractères`,
			],
		},
		choregraphe: {
			type: String,
			trim: true,
			null: [
				false,
				"Le prénom et nom du chorégraphe ne doit pas être nul",
			],
			required: false,
			minLength: [
				cnt.choregraphe.longueurMin,
				`Le chorégraphe doit avoir entre ${cnt.choregraphe.longueurMin} et ${cnt.choregraphe.longueurMax} caractères`,
			],
			maxLength: [
				cnt.choregraphe.longueurMax,
				`Le chorégraphe doit avoir entre ${cnt.choregraphe.longueurMin} et ${cnt.choregraphe.longueurMax} caractères`,
			],
		},
		musique: {
			type: String,
			trim: true,
			null: [false, "La musique ne doit pas être nulle"],
			required: [true, "La musique est requise"],
			minLength: [
				cnt.musique.longueurMin,
				`La musique doit avoir entre ${cnt.musique.longueurMin} et ${cnt.musique.longueurMax} caractères`,
			],
			maxLength: [
				cnt.musique.longueurMax,
				`La musique doit avoir entre ${cnt.musique.longueurMin} et ${cnt.musique.longueurMax} caractères`,
			],
		},
		niveau: {
			type: Number,
			enum: [
				Object.values(NIVEAU),
				`Le niveau minimum est ${NIVEAU_STR[1]}`,
			],
			min: [1, `Le niveau minimum est ${NIVEAU_STR[1]}`],
			required: [true, "Le niveau est requis"],
		},
		detailsTag: {
			type: String,
			trim: true,
			required: false,
			null: [false, "Le tag ne doit pas être nul"],
			minLength: [
				cnt.detailsTag.longueurMin,
				`Le tag doit avoir entre ${cnt.detailsTag.longueurMin} et ${cnt.detailsTag.longueurMax} caractères`,
			],
			maxLength: [
				cnt.detailsTag.longueurMax,
				`Le tag doit avoir entre ${cnt.detailsTag.longueurMin} et ${cnt.detailsTag.longueurMax} caractères`,
			],
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
			set: racourcirLienYoutube,
			validate: [
				{
					validator: verifierVideoJouable,
					message: "La vidéo n'est pas jouable en raison de restrictions mises en place par son auteur. Veuillez en choisir une autre",
				}
			],
		},
		lienVideoMusique: {
			type: String,
			trim: true,
			required: false,
			null: [
				false,
				"Le lien de la vidéo de la musique ne doit pas être nul",
			],
			set: racourcirLienYoutube,
			validate: [
				{
					validator: verifierVideoJouable,
					message: "La vidéo n'est pas jouable en raison de restrictions mises en place par son auteur. Veuillez en choisir une autre",
				}
			],
		},
		lienVideoAcademie: {
			type: String,
			trim: true,
			required: false,
			null: [
				false,
				"Le lien de la vidéo de l'Académie ne doit pas être nul",
			],
		},
		nbComptes: {
			type: Number,
			required: [true, "Le nombre de comptes doit être inscrit."],
			null: [false, "Le nombre de comptes ne doit pas être nul."],
			min: [
				cnt.nbComptes.min,
				`Le nombre de comptes doit être entre ${cnt.nbComptes.min} et ${cnt.nbComptes.max}`,
			],
			max: [
				cnt.nbComptes.max,
				`Le nombre de comptes doit être entre ${cnt.nbComptes.min} et ${cnt.nbComptes.max}`,
			],
		},
		nbMurs: {
			type: Number,
			required: [true, "Le nombre de murs doit être inscrit."],
			null: [false, "Le nombre de murs ne doit pas être nul"],
			min: [
				cnt.nbMurs.min,
				`Le nombre de murs doit être entre ${cnt.nbMurs.min} et ${cnt.nbMurs.max}`,
			],
			max: [
				cnt.nbMurs.max,
				`Le nombre de murs doit être entre ${cnt.nbMurs.min} et ${cnt.nbMurs.max}`,
			],
		},
		estCoupDeCoeur: {
			type: Boolean,
			default: false,
			required: false,
			null: [false, "Le coup de coeur ne doit pas être nul"],
		},
		noteMoyenne: {
			type: Number,
			required: false,
			null: [false, "La note moyenne ne doit pas être nulle."],
			min: [
				contraintes.appreciation.note.min,
				`La note moyenne doit être entre ${contraintes.appreciation.note.min} et ${contraintes.appreciation.note.max}`,
			],
			max: [
				contraintes.appreciation.note.max,
				`La note moyenne doit être entre ${contraintes.appreciation.note.min} et ${contraintes.appreciation.note.max}`,
			],
		},
	},
	{
		methods: {
			/**
			 * Requête qui permet d'obtenir la moyenne des appréciations
			 */
			calculerNoteMoyenne() {
				return model("Appreciation")
					.aggregate()
					.match({ danse: this._id })
					.group({ _id: null, moyenne: { $avg: "$note" } })
					.project({ _id: 0, moyenne: { $round: ["$moyenne", 1] } });
			},
		},
		timestamps: true,
	}
);

// Ajout d'un index textuel pour la recherche:
DanseSchema.index(
	{
		titre: "text",
		choregraphe: "text",
		musique: "text",
	},
	{
		// eslint-disable-next-line camelcase
		default_language: "french",
		weights: {
			titre: 20,
			musique: 15,
			choregraphe: 2,
		},
	}
);

export const Danse = Mongoose.models.Danse ?? new model("Danse", DanseSchema);
export default Danse;
