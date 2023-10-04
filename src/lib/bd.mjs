// Importation du paquet NPM pour MongoDB:
import mongoose, { Model, model } from "mongoose";

// Importation des schémas:
import SchemaSession from "./models/session.mjs";
import SchemaUsager from "./models/usager.mjs";
import SchemaAppreciation from "./models/appreciation.mjs";
import SchemaDanse from "./models/danse.mjs";
import SchemaCours from "./models/cours.mjs";

// Importation des autres dépendances:
import { hacherMdp } from "./cryptographie.mjs";
import { ErrUtilisateurExiste, MongoServerError } from "./bd-exceptions.mjs";
import { obtenirDimancheSuivant } from "./date.mjs";

// Importation des interfaces:
/** @typedef {import("./interfaces.mjs").IDateEvenement} IDateEvenement */
/** @typedef {import("./interfaces.mjs").IPhoto} IPhoto */
/** @typedef {import("./interfaces.mjs").ILien} ILien */

// Raccourci pour ObjectId:
const ObjectId = mongoose.mongo.ObjectId;

// Obtention du MONGO_URL depuis le fichier .env:
const urlConnexion = import.meta.env.MONGO_URL?.trim();
const nomBase = import.meta.env.MONGO_BASE?.trim();

// Validation du MONGO_URL:
if (
	urlConnexion == null ||
	urlConnexion.length < 1 ||
	nomBase == null ||
	nomBase.length < 1
) {
	throw new Error(
		"Veuillez configurer un fichier .env contenant une clé MONGO_URL."
	);
}

// Connexion à mongo avec la connexion Mongoose par défaut:
await mongoose.connect(urlConnexion);
await mongoose.connection.useDb(nomBase);

// Création des modèles à partir des schémas:
/** @type {Model<SchemaSession>} */
export const Session = model("Session", SchemaSession);
/** @type {Model<SchemaUsager>} */
const Usager = model("Usager", SchemaUsager);
/** @type {Model<SchemaAppreciation>} */
const Appreciation = model("Appreciation", SchemaAppreciation);
/** @type {Model<SchemaDanse>} */
const Danse = model("Danse", SchemaDanse);
/** @type {Model<SchemaCours>} */
const Cours = model("Cours", SchemaCours);

/**
 * Classe de communication avec la base MongoDB
 */
export default class Bd {
	/**
	 * Obtient une session ayant la clé donnée.
	 *
	 * @param {String} cleSession clé publique de la session
	 * @returns {Promise<Session>} instance de la Session
	 */
	static async obtenirSession(cleSession) {
		return await Session.findOne({
			cle: cleSession,
			dateExpiration: { $gt: new Date() },
		});
	}

	/**
	 * Supprime la session de l'usager donné.
	 *
	 * @param {String} idUsager identifiant unique de l'usager
	 * @returns {Promise<void>} rien
	 */
	static async supprimerSession(idUsager) {
		const usager = new ObjectId(idUsager);
		await Session.deleteOne({ usager: usager });
	}

	/**
	 * Ajoute une nouvelle session dans la collection des sessions.
	 *
	 * @param {String} cleSession clé publique de la session
	 * @param {String} idUsager identifiant unique de l'usager
	 * @param {Date} expiration date d'expiration de la session
	 * @returns {Promise<Session>} instance de la nouvelle Session
	 */
	static async nouvSession(cleSession, idUsager, expiration) {
		await Bd.supprimerSession(idUsager);
		const usager = new ObjectId(idUsager);
		const session = new Session({
			cle: cleSession,
			usager: usager,
			dateExpiration: expiration,
		});
		await session.save();

		return session;
	}

	/**
	 * Permet de créer un nouvel usager standard (pas superutilisateur)
	 *
	 * @param {String} courriel adresse courriel
	 * @param {String} prenom prénom
	 * @param {String} nom nom
	 * @param {String} telephone numéro de téléphone
	 * @param {String} mdp mot de passe en clair
	 * @throws {ErrUtilisateurExiste} si un usager avec le même courriel existe
	 * @throws {MongoServerError} pour tout autre erreur
	 * @returns {Promise<Usager>} référence au nouvel Usager
	 */
	static async creerNouvUsager(courriel, prenom, nom, telephone, mdp) {
		// Création de l'usager:
		const usager = new Usager({
			prenom,
			nom,
			courriel,
			telephone,
			mdp: await hacherMdp(mdp),
			estActive: true,
		});

		// Tentative d'enregistrement:
		try {
			await usager.save();
		} catch (err) {
			if (err.code && err.code == 11000)
				throw new ErrUtilisateurExiste(err.message ?? "");
			else throw err;
		}

		return usager;
	}

	/**
	 * Obtient un usager à partir de son adresse courriel
	 *
	 * @param {String} courriel adresse courriel de l'usager
	 * @returns {Promise<Usager>} instance de l'Usager
	 */
	static async obtenirUsagerParCourriel(courriel) {
		return await Usager.findOne({ courriel, estValide: true });
	}

	/** Création d'une danse
	 * @returns {Promise<Danse>}
	 */
	static async creerDanse(
		titre,
		choregraphe,
		musique,
		niveau,
		detailsTag,
		lienFeuille,
		lienVideoDanse,
		lienVideoMusique,
		lienVideoAcademie,
		nbComptes,
		nbMurs,
		estCoupDeCoeur
	) {
		const danse = new Danse({
			titre,
			choregraphe,
			musique,
			niveau,
			detailsTag,
			lienFeuille,
			lienVideoDanse,
			lienVideoMusique,
			lienVideoAcademie,
			nbComptes,
			nbMurs,
			estCoupDeCoeur,
		});
		return await danse.save();
	}

	/** Création d'un cours
	 * @returns {Promise<void>}
	 */
	static async creerCours(niveau, date, lieu, danses) {
		const cours = new Cours({
			niveau,
			date,
			lieu,
			danses,
		});
		await cours.save();
	}

	/**
	 * Trouver les cours de la semaine à partir du dimanche donné
	 *
	 * @param {Date} dimanche le dimanche à partir duquel chercher
	 * @returns {Promise<Cours[]>} liste des cours
	 */
	static async obtenirCoursDeLaSemaine(dimanche) {
		const coursDeLaSemaine = await Cours.find({
			date: {
				$gte: dimanche,
				$lt: obtenirDimancheSuivant(dimanche),
			},
		})
			.populate("danses")
			.sort({
				date: 1,
			});


		return coursDeLaSemaine;
	}
}
