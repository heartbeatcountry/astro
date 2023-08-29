// importation du paquet NodeJS pour la cryptographie:
import { randomBytes, createCipheriv, createDecipheriv, BinaryLike, CipherKey, Encoding } from "node:crypto";

/**
 * Algorithme de cryptage
 *
 * Nous utilisons un algorithme symmétrique pour utiliser la même clé à la fois
 * pour crypter et pour décrypter
 */
const algo = "aes-256-cbc";

/**
 * Longueur absolue du vecteur d'initialisation
 */
const LONGUEUR_VECT_INIT = 16;

/**
 * Longueur absolue de la clé secrète
 */
const LONGUEUR_CLE_SECRETE = 32;

/**
 * Encodage des objets JSON en mémoire
 *
 * @type {Encoding}
 */
const ENCODAGE_MEMOIRE = "utf-8";

/**
 * Encodage des objets JSON en transit
 *
 * @type {Encoding}
 */
const ENCODAGE_TRANSIT = "base64url";

/**
 * Vecteur d'initialisation
 *
 * Si nous avons déjà un vecteur d'initialisation, on l'utilise. Sinon, on doit
 * en créer un.
 *
 * @type {BinaryLike}
 */
let iv = import.meta.env.SESSION_CRYPTO_VECT?.trim() ?? null;

// Si nous n'avons pas de vecteur d'initialisation, on en crée un:
if (iv === null || iv.length !== LONGUEUR_VECT_INIT) {
	iv = randomBytes(LONGUEUR_VECT_INIT);
}

/**
 * Clé secrète
 *
 * Si nous avons déjà une clé secrète, on l'utilise. Sinon, on doit en créer
 * une.
 *
 * @type {CipherKey}
 */
let cleSecrete = import.meta.env.SESSION_CRYPTO_CLE_SECRETE?.trim() ?? null;

// Si nous n'avons pas de clé secrète, on en crée une:
if (cleSecrete === null || iv.length !== LONGUEUR_CLE_SECRETE) {
	cleSecrete = randomBytes(LONGUEUR_CLE_SECRETE);
}

/**
 * Encrypte l'objet JavaScript donné
 *
 * @param {Record<String,any>} obj Objet à encrypter
 * @returns {String} L'objet sous forme sérialisée et encryptée
 */
export const encrypterObjet = obj => {
	const objJson = JSON.stringify(obj);
	const cipher = createCipheriv(algo, cleSecrete, iv);
	const msg = cipher.update(objJson, ENCODAGE_MEMOIRE, ENCODAGE_TRANSIT) + cipher.final(ENCODAGE_TRANSIT);
	return msg;
};

/**
 * Décrypte un objet précédemment encrypté avec encrypterObjet()
 *
 * @param {String} msg Objet sérialisé et encrypté
 * @returns {Record<String,any>} L'objet décrypté
 */
export const decrypterObjet = msg => {
	const decipher = createDecipheriv(algo, cleSecrete, iv);
	const json = decipher.update(msg, ENCODAGE_TRANSIT, ENCODAGE_MEMOIRE) + decipher.final(ENCODAGE_MEMOIRE);
	const obj = JSON.parse(json);
	return obj;
}

export default {
	encrypterObjet,
	decrypterObjet,
};
