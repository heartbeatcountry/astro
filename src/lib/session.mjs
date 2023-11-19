// eslint-disable-next-line no-unused-vars
import { chaineAleatoire } from "./cryptographie.mjs";
import Bd from "./bd.mjs";
// eslint-disable-next-line no-unused-vars
import { Session as ModeleSession } from "./bd.mjs";

const env = import.meta.env ?? process.env;

/**
 * Nombre d'heures avant qu'une session expire et que l'utilisateur doivent se
 * reconnecter.
 */
const SESSION_EXPIRATION_HEURES = parseInt(env.SESSION_EXPIRATION_HEURES ?? 48);

/**
 * Nom du cookie (ne doit pas être modifié).
 */
const NOM_COOKIE = "sess";

/**
 * Nombre d'octets d'entropie pour la clé de session.
 *
 * 64 octets d'entropie offrent une sécurité adéquate mais aller au-delà de 256
 * octets n'offre aucun avantage concret.
 */
const NB_OCTETS_ENTROPIE = 256;

/**
 * Regex pour valider une chaîne de caractères en base64url
 */
const REGEX_BASE64_URL = new RegExp(/^[a-zA-Z0-9-_]+$/);

/**
 * Représente la session d'un utilisateur connecté
 */
export default class Session {
	/**
	 * Crée une nouvelle session pour l'usager donné et la stocke en cookie dans
	 * le navigateur de l'usager.
	 *
	 * @param {AstroCookies} cookies Référence à l'instance de Astro.cookies
	 * @param {String} idUsager Identifiant de l'usager
	 * @returns {Promise<ModeleSession>} une référence à la nouvelle session
	 */
	static async nouvSession(cookies, idUsager) {
		// Création de la clé de session:
		const cle = chaineAleatoire(NB_OCTETS_ENTROPIE);

		// Obtention de la date d'expiration:
		const expiration = new Date();
		expiration.setHours(expiration.getHours() + SESSION_EXPIRATION_HEURES);

		// Ajout/mise à jour de la session dans la BD:
		const session = await Bd.nouvSession(cle, idUsager, expiration);

		// Ajout/mise à jour de la session dans le navigateur:
		cookies.set(NOM_COOKIE, cle, {
			expires: expiration,
			httpOnly: true,
			path: "/",
		});

		// On retourne une référence à la session:
		return session;
	}


	/**
	 * Restaure une session à partir d'un cookie encrypté.
	 *
	 * @param {AstroCookies} cookies Référence à l'instance de Astro.cookies
	 * @returns {Promise<ModeleSession>} Une nouvelle instance de la classe ou
	 * null si aucune session existe pour l'usager
	 */
	static async obtenirDepuisCookie(cookies) {
		const cleSession = cookies.get(NOM_COOKIE)?.value;

		return await this.validerDepuisCleSession(cleSession);
	}

	/**
	 * Restaure une session à partir d'une clé de session
	 *
	 * @param {string} cle clé de la session
	 * @returns {Promise<ModeleSession>} Une nouvelle instance de la classe ou
	 * null si aucune session existe pour l'usager
	 */
	static async validerDepuisCleSession(cleSession) {
		if (!cleSession || !REGEX_BASE64_URL.test(cleSession)) {
			return null;
		}

		const session = await Bd.obtenirSession(cleSession);
		return session;
	}

	/**
	 * Détruire la session de l'utilisateur.
	 *
	 * @param {AstroCookies} cookies Référence à l'instance de Astro.cookies
	 */
	static async detruire(cookies) {
		const session = await Session.obtenirDepuisCookie(cookies);

		if (session != null) {
			session.deleteOne();
		}

		cookies.delete(NOM_COOKIE);
	}
}
