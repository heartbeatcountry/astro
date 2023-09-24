/**
 * Permet de hacher du texte côté client
 *
 * @param {String} clair - Le texte à hacher
 * @param {"SHA-1"|"SHA-256"|"SHA-384"|"SHA-512"} algo - L'algorithme de hachage à employer
 * @returns {Promise<String>} le texte, haché selon l'algo choisie
 */
export const hacher = async (clair, algo) =>
	Array.from(new Uint8Array(
		await crypto.subtle.digest(algo, (new TextEncoder()).encode(clair))
	)).map(b => b.toString(16).padStart(2, "0")).join("");

/**
* Permet de hacher du texte en SHA-1
*
* @param {String} clair - Le texte à hacher
* @returns {Promise<String>} le texte, haché en SHA-1
*/
export const sha1 = async clair => await hacher(clair, "SHA-1");

/**
* Permet de hacher du texte en SHA-256
*
* @param {String} clair - Le texte à hacher
* @returns {Promise<String>} le texte, haché en SHA-256
*/
export const sha256 = async clair => await hacher(clair, "SHA-256");
