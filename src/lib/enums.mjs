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
	/** Débutant 1 */
	INITIATION: 0,
	/** Débutant 2 */
	DEBUTANT: 1,
	/** Débutant-intermédiaire */
	NOVICE: 2,
	/** Intermédiaire */
	INTERMEDIAIRE: 3,
	/** Expérimenté */
	AVANCE: 4,
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
