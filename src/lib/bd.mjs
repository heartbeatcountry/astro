// Importation du paquet NPM pour MongoDB:
import { MongoClient } from "mongodb";

// Importation des types JSDoc pour MongoDB:
/** @typedef {import("mongodb").Db} Db */
/** @typedef {import("mongodb").Collection} Collection */

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
	 * @type {MongoClient}
	 */
	static #client = new MongoClient(urlConnexion);

	/**
	 * Référence à la base de donnée
	 * @type {Db}
	 */
	static #base = null;

	/**
	 * Référence aux collections de la base de données.
	 * @type {Map<String,Collection>}
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
		if (Bd.#base !== null) {
			return;
		}

		// Connexion au serveur MongoDB:
		await Bd.#client.connect();

		// Connexion à la base de données:
		Bd.#base = Bd.#client.db(nomBase);
	}

	/**
	 * Obtient une référence à la collection donnée en paramètre.
	 * @param {String} nom nom de la collection
	 * @returns {Promise<Collection>} Une référence à la collection MongoDB
	 */
	static async #obtenirCollection(nom) {
		await Bd.#etablirConnexionAvecBase();
		let collection = Bd.#collections.get(nom);

		if (collection === undefined) {
			collection = Bd.#base.collection(nom);
			Bd.#collections.set(nom, collection);
		}

		return collection;
	}



	/***************************************************************************
	 ************************** Méthodes publiques *****************************
	 **************************************************************************/

	/**
	 *
	 * @param {String} permalien Le permalien de la danse
	 * @returns Les détails de la danse
	 */
	static async obtenirDetailsDanse(permalien) {
		const danses = await Bd.#obtenirCollection("danses");
		return await danses.findOne({ permalien: permalien });
	}
}
