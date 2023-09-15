// Importation du paquet NPM pour MongoDB:
import mongoose from "mongoose";
import ModeleSession from "./models/session.mjs";
import ModeleUsager from "./models/usager.mjs";

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
if (urlConnexion == null || urlConnexion.length < 1 || nomBase == null || nomBase.length < 1) {
	throw new Error("Veuillez configurer un fichier .env contenant une clé MONGO_URL.");
}


/**
 * Classe de communication avec la base MongoDB
 */
export default class Bd {
	/***************************************************************************
	 ************************* Propriétés statiques ****************************
	 **************************************************************************/

	/**
	 * Référence de connexion à MongoDB
	 * @type {mongoose.Connection}
	 */
	static #client = null;

	/**
	 * Référence aux collections de la base de données.
	 * @type {Map<String,mongoose.Model>}
	 */
	static #collections = new Map();



	/***************************************************************************
	 *************************** Méthodes privées ******************************
	 **************************************************************************/

	/**
	 * Établit une connexion avec la base de données si ce n'est pas déjà fait.
	 */
	static async #etablirConnexionAvecBase() {
		// Si déjà connecté, nul besoin de reconnecter:
		if (Bd.#client !== null) {
			return;
		}

		// Connexion au serveur MongoDB:
		Bd.#client = await mongoose.createConnection(urlConnexion);

		// Connexion à la base de données:
		Bd.#client.useDb(nomBase);
	}

	/**
	 * Initialise les modèles et collections de la base MongoDB
	 */
	static async #initialiserModeles() {
		await this.#etablirConnexionAvecBase();

		Bd.#collections
			.set("sessions", Bd.#client.model("Session", ModeleSession))
			.set("usagers", Bd.#client.model("Usager", ModeleUsager));
	}

	/**
	 * Obtient une référence à la collection donnée en paramètre.
	 * @param {String} nom nom de la collection
	 * @returns {Promise<mongoose.Model>} Une référence à la collection MongoDB
	 */
	static async #obtenirCollection(nom) {
		if (Bd.#collections.size < 1) {
			await Bd.#initialiserModeles();
		}

		return Bd.#collections.get(nom);
	}



	/***************************************************************************
	 ************************** Méthodes publiques *****************************
	 **************************************************************************/

	/**
	 * Obtient une session ayant la clé donnée.
	 *
	 * @param {String} cleSession clé publique de la session
	 * @returns {typeof ModeleSession}
	 */
	static async obtenirSession(cleSession) {
		const sessions = await Bd.#obtenirCollection("sessions");
		return await sessions.findOne({ cle: cleSession, dateExpiration: { $gt: new Date() } });
	}

	/**
	 * Supprime la session de l'usager donné.
	 *
	 * @param {String} idUsager identifiant unique de l'usager
	 */
	static async supprimerSession(idUsager) {
		const sessions = await Bd.#obtenirCollection("sessions");
		const usager = new ObjectId(idUsager);
		await sessions.deleteOne({ usager: usager });
	}

	/**
	 * Ajoute une nouvelle session dans la collection des sessions.
	 *
	 * @param {String} cleSession clé publique de la session
	 * @param {String} idUsager identifiant unique de l'usager
	 * @param {Date} expiration date d'expiration de la session
	 * @returns {typeof ModeleSession}
	 */
	static async nouvSession(cleSession, idUsager, expiration) {
		const sessions = await Bd.#obtenirCollection("sessions");
		await Bd.supprimerSession(idUsager);
		const usager = new ObjectId(idUsager);
		const session = new sessions({
			cle: cleSession,
			usager: usager,
			dateExpiration: expiration
		});
		await session.save();

		return session;
	}

	/**
	 * Obtient tous les champs d'un document de la collection `danses`
	 *
	 * @param {String} permalien Le permalien de la danse
	 * @returns Les détails de la danse
	 */
	static async obtenirDetailsDanse(permalien) {
		const danses = await Bd.#obtenirCollection("danses");
		return await danses.findOne({ permalien: permalien });
	}
}
