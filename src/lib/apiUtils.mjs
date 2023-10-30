/**
 * Crée une réponse pour une route d'API
 *
 * @param {any} obj Objet à sérialiser
 * @param {number?} statut statut HTTP à envoyer
 * @returns {Response} un objet Response prêt à être envoyé
 */
export function repondreJson(obj, statut = 200) {
	return new Response(JSON.stringify(obj), {
		status: statut,
		headers: {
			"Content-Type": "application/json",
		}
	});
}

/**
 * Crée une réponse d'erreur pour une route d'API
 *
 * @param {string} msg message d'erreur
 * @param {number?} statut statut HTTP à utiliser (400 par défaut)
 * @returns {Response} un objet Response prêt à être envoyé
 */
export function repondreErr(msg, statut = 400) {
	return repondreJson({
		erreur: msg,
	}, statut);
}

/**
 * Permet de caster un objet en chaîne de caractères d'une longueur fixe.
 *
 * @param {any} obj objet à caster
 * @param {string?} defaut valeur par défaut
 * @param {number?} longueurMax longueur maximale (l'excédent sera tronqué)
 * @returns {string} l'objet d'origine, casté en chaîne de caractères
 */
export function casterChaine(obj, defaut = "", longueurMax = 255) {
	return (obj?.toString().trim() ?? defaut).substring(0, longueurMax);
}

/**
 * Permet de caster un objet en entier contraint entre deux bornes.
 *
 * @param {any} obj objet à caster
 * @param {number?} defaut valeur par défaut
 * @param {number?} min valeur minimum (sera borné à cette valeur)
 * @param {number?} max valeur maximum (sera borné à cette valeur)
 * @returns {number} l'objet d'origine, casté en nombre et borné
 */
export function casterEntier(obj, defaut = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
	return Math.max(min, Math.min(max, +(obj?.toString().trim() ?? defaut) || defaut));
}

/**
 * Obtient une chaîne de caractères depuis les QueryString.
 *
 * @param {URL} url URL à analyser
 * @param {string} nom nom du paramètre
 * @param {string?} defaut valeur par défaut
 * @param {number?} longueurMax longueur maximale (l'excédent sera tronqué)
 * @returns {string} valeur du paramètre
 */
export function obtenirQueryChaine(url, nom, defaut = "", longueurMax = 255) {
	return casterChaine(url.searchParams.get(nom), defaut, longueurMax);
}

/**
 * Obtient un entier depuis les searchParams.
 *
 * @param {URL} url URL à analyser
 * @param {string} nom nom du paramètre
 * @param {number?} defaut valeur par défaut
 * @param {number?} min valeur minimum (sera borné à cette valeur)
 * @param {number?} max valeur maximum (sera borné à cette valeur)
 * @returns {number} valeur du paramètre
 */
export function obtenirQueryEntier(url, nom, defaut = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
	return casterEntier(url.searchParams.get(nom), defaut, min, max);
}
