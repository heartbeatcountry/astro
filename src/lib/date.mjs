/**
 * Formater la date
 *
 * @param {Date} date la date à formater
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
 * Obtenir la date du dimanche précédent
 *
 * @param {Date} date date d'origine
 * @returns date du dimanche précédent
 */
export const obtenirDimanchePrecedent = (date) => {
	const aujourdhui = new Date();
	const jourDuMois = aujourdhui.getDate();
	const jourDeSemaine = aujourdhui.getDay();
	return new Date(aujourdhui.setDate(jourDuMois - jourDeSemaine));
};

/**
 * Obtenir la date du samedi suivant
 *
 * @param {Date} date date d'origine
 * @returns date du samedi suivant
 */
export const obtenirSamediSuivant = (date) => {
	const aujourdhui = new Date(date);
	const joursRestants = 5 - aujourdhui.getDay();
	aujourdhui.setDate(aujourdhui.getDate() + joursRestants + 1);
	return aujourdhui;
  };
