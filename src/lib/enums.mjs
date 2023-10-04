/**
 * @module enums
 */

/**
 * Niveau de difficulté pour une danse ou un événement
 *
 * @readonly
 * @enum {number}
 * @memberof enums
 */
export const NIVEAU = Object.freeze({
	/** Ultra-Débutant */
	INITIATION: 0,
	/** Débutant */
	DEBUTANT: 1,
	/** Novice */
	NOVICE: 2,
	/** Intermédiaire */
	INTERMEDIAIRE: 3,
	/** Avancé */
	AVANCE: 4,
});
export const NIVEAU_STR = Object.freeze({
    [NIVEAU.INITIATION]: "Ultra-Débutant",
    [NIVEAU.DEBUTANT]: "Débutant",
    [NIVEAU.NOVICE]: "Novice",
    [NIVEAU.INTERMEDIAIRE]: "Intermédiaire",
    [NIVEAU.AVANCE]: "Avancé",
});

/**
 * Le type d'accès pour une danse ou un événement
 *
 * @readonly
 * @enum {number}
 * @memberof enums
 */
export const TYPE_ACCES = Object.freeze({
	/** Tout le monde peut participer */
	OUVERT_A_TOUS: 0,
	/** Seuls les élèves peuvent participer */
	ELEVES_SEULEMENT: 1,
});
