// Importation du paquet NPM pour MongoDB:
import mongoose, { Model, model } from "mongoose";

// Importation des schémas:
import SchemaSession from "./models/session.mjs";
import SchemaUsager from "./models/usager.mjs";
import SchemaAppreciation from "./models/appreciation.mjs";

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

// Connexion à mongo avec la connexion Mongoose par défaut:
await mongoose.connect(urlConnexion);
await mongoose.connection.useDb(nomBase);

// Création des modèles à partir des schémas:
/** @type {Model<SchemaSession>} */
export const Session = model("Session", SchemaSession);
/** @type {Model<SchemaUsager>} */
const Usager = model("Usager", SchemaSession);
/** @type {Model<SchemaAppreciation>} */
const Appreciation = model("Appreciation", SchemaAppreciation);


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
		return await Session.findOne({ cle: cleSession, dateExpiration: { $gt: new Date() } });
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
			dateExpiration: expiration
		});
		await session.save();

		return session;
	}
}
