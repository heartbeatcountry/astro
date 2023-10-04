/**
 * Formater la date afin d'afficher le jour, la date et le mois
 *
 * @param {Date} date la date à formater
 * @param {Boolean} afficherHeure vrai s'il faut aussi afficher l'heure
 * @returns une représentation textuelle de la date
 */
export const formaterDate = (date, afficherHeure = false) => {
	let options = {
		weekday: "long",
		month: "long",
		day: "numeric",
	};

	if (afficherHeure) {
		Object.assign(options, {
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	return date.toLocaleDateString("fr-CA", options);
};


/**
 * Formater la date
 *
 * @param {Date} date la date à formater
 * @param {Boolean} afficherHeure vrai s'il faut aussi afficher l'heure
 * @returns une représentation textuelle de la date
 */
export const formaterDateJour = (date, afficherHeure = false) => {
	let options = {
		weekday: "long",
	};

	if (afficherHeure) {
		Object.assign(options, {
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	return date.toLocaleDateString("fr-CA", options);
};

/**
 * Calcule une date relative à partir d'une date donnée. Le paramètre `nbJours`
 * ajoute (ou, si négatif, retire) le nombre de jours donné à la date donnée.
 *
 * @param {Date} date date à partir de laquelle calculer la nouvelle date
 * @param {Number} nbJours nombre de jours à ajouter ou retirer
 * @returns {Date} la nouvelle date
 */
export const obtenirDateRelative = (date, nbJours) => {
	// Créer une copie de la date d'origine, afin de ne pas effectuer de mutations:
	const nouvDate = new Date(date);

	// Remettre l'heure à 00:00:00.000:
	nouvDate.setHours(0, 0, 0, 0);

	// Ajouter ou retirer des jours:
	nouvDate.setDate(nouvDate.getDate() + nbJours);

	return nouvDate;
};

/**
 * Obtenir la date du dimanche précédent la date donnée
 *
 * @param {Date} date date d'origine
 * @returns {Date} date du dimanche précédent
 */
export const obtenirDimanchePrecedent = (date = new Date()) => {
	const jourDeSemaine = date.getDay();
	return obtenirDateRelative(date, -jourDeSemaine);
};

/**
 * Obtenir la date du samedi suivant la date donnée
 *
 * @param {Date} date date d'origine
 * @returns {Date} date du samedi à venir
 */
export const obtenirSamediSuivant = (date = new Date()) => {
	const dimanchePrecedent = obtenirDimanchePrecedent(date);
	return obtenirDateRelative(dimanchePrecedent, +6);
};

/**
 * Obtenir la date du dimanche suivant la date donnée
 *
 * @param {Date} date date d'origine
 * @returns {Date} date du dimanche à venir
 */
export const obtenirDimancheSuivant = (date = new Date()) => {
	const dimanchePrecedent = obtenirDimanchePrecedent(date);
	return obtenirDateRelative(dimanchePrecedent, +7);
};
