import { AstroGlobal } from "astro";

// Importation des méthodes cryptographiques:
import { encrypterObjet, decrypterObjet } from "./cryptographie.mjs";

/**
 * Nombre d'heures avant qu'une session expire et que l'utilisateur doivent se
 * reconnecter.
 */
const SESSION_EXPIRATION_HEURES = parseInt(import.meta.env.SESSION_EXPIRATION_HEURES ?? 48);

/**
 * Nom du cookie (ne doit pas être modifié).
 */
const NOM_COOKIE = "sess";

/**
 * Représente la session d'un utilisateur connecté
 */
export default class Session {
	/**
	 * Identifiant unique de l'usager
	 * @type {String}
	 */
	#identifiantUnique;
	/**
	 * Nom de connexion de l'usager
	 * @type {String}
	 */
	#nomConnexion;
	/**
	 * Vrai si l'usager est un administrateur
	 * @type {Boolean}
	 */
	#estAdmin;
	/**
	 * Date d'expiration de la session
	 * @type {Date}
	 */
	#expireLe;

	/**
	 *
	 * @param {String} identifiantUnique Identifiant unique de l'usager dans la BD
	 * @param {String} nomConnexion Nom de connexion de l'usager
	 * @param {Boolean?} estAdmin Vrai si l'usager doit avoir des droits d'admin
	 * @param {Date?} expiration Date d'expiration de la session
	 */
	constructor(identifiantUnique, nomConnexion, estAdmin = false, expiration = null) {
		this.#identifiantUnique = identifiantUnique;
		this.#nomConnexion = nomConnexion;
		this.#estAdmin = estAdmin;

		if (expiration === null) {
			this.renouveler();
		} else {
			this.#expireLe = expiration;
		}
	}

	/**
	 * Renouvelle la session d'un usager si elle n'est pas expirée
	 */
	renouveler() {
		if (this.estExpiree) {
			return;
		}

		const expiration = new Date();
		expiration.setHours(expiration.getHours() + SESSION_EXPIRATION_HEURES);
		this.#expireLe = expiration;
	}

	/**
	 * Obtient l'identifiant unique de l'usager
	 * @type {String}
	 */
	get identifiantUnique() {
		return this.#identifiantUnique;
	}

	/**
	 * Obtient le nom de connexion de l'usager
	 * @type {String}
	 */
	get nomConnexion() {
		return this.#nomConnexion;
	}

	/**
	 * Vérifie si l'usager est un administrateur
	 * @type {Boolesn}
	 */
	get estAdmin() {
		return this.#estAdmin;
	}

	/**
	 * Vrai si la session est expirée
	 * @type {Boolean}
	 */
	get estExpiree() {
		return (new Date()) >= this.#expireLe;
	}

	/**
	 * Sérialise et encrypte la session. Retourne une valeur qui peut être
	 * utilisée comme cookie.
	 * @type {String}
	 */
	get cookie() {
		return encrypterObjet(this);
	}

	/**
	 * Définit la structure de sérialisation lorsque la classe Session est
	 * sérialisée avec JSON.stringify()
	 *
	 * @returns {Record<string,any>} L'objet à sérialiser
	 */
	toJSON() {
		return {
			identifiantUnique: this.identifiantUnique,
			nomConnexion: this.nomConnexion,
			estAdmin: this.estAdmin,
			expireLe: this.#expireLe,
		}
	}

	/**
	 * Ajoute un cookie de session pour le visiteur.
	 *
	 * @param {AstroGlobal} Astro Référence à l'instance de Astro
	 */
	ecrireCookie(Astro) {
		Astro.cookies.set(NOM_COOKIE, this.cookie, {});
		// >>>>>>>>>>>>> AstroCookieOptions
	}

	/**
	 * Convertit un objet JSON désérialisé en classe Session.
	 * C'est l'inverse de la méthode toJSON().
	 *
	 * @param {Record<String,any>} objJson Objet json désérialisé
	 * @returns {Session} Une nouvelle instance de la classe
	 */
	static #depuisJson(objJson) {
		if (
			!Reflect.has(objJson, "identifiantUnique") ||
			!Reflect.has(objJson, "nomConnexion") ||
			!Reflect.has(objJson, "estAdmin") ||
			!Reflect.has(objJson, "expireLe") ||
			typeof objJson.identifiantUnique !== "string" ||
			typeof objJson.nomConnexion !== "string" ||
			typeof objJson.estAdmin !== "boolean" ||
			typeof objJson.expireLe !== "string"
		) {
			throw new SyntaxError("Le cookie de session est invalide");
		}

		return new Session(objJson.identifiantUnique, objJson.nomConnexion, objJson.estAdmin, new Date(objJson.expireLe));
	}

	/**
	 * Restaure une session à partir d'un cookie encrypté.
	 *
	 * @param {AstroGlobal} Astro Référence à l'instance de Astro
	 * @returns {Session?} Une nouvelle instance de la classe ou null si aucune
	 * session existe pour l'usager
	 */
	static obtenirDepuisCookie(Astro) {
		const cookie = Astro.cookies.get(NOM_COOKIE).value;

		if (!cookie) {
			return null;
		}

		return Session.#depuisJson(decrypterObjet(cookie));
	}
}
