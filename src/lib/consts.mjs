/* eslint-disable no-control-regex */
/**
 * Expression rationnelle pour valider les adresses courriel (RFC 5322)
 */
const regexCourriel = new RegExp(
	/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i
);

/**
 * Contraintes de validation.
 * Utilisées dans les modèles mongodb et pour la validation des formulaires
 */
export const contraintes = {
	/**
	 * Contraintes pour un compte d'usager
	 */
	usager: {
		/**
		 * Prénom et nom
		 */
		nom: {
			longueurMin: 1,
			longueurMax: 50,
		},
		/**
		 * Adresse courriel (nom de connexion)
		 */
		courriel: {
			regex: regexCourriel,
		},
		/**
		 * Mot de passe
		 */
		mdp: {
			longueurMin: 8,
			longueurMax: 255, // sera haché côté serveur avant stockage
			hacherCoteClient: true,
		},

		telephone: {
			regex: /^\(?([0-9]{3})\)?[- ]?([0-9]{3})[-]?([0-9]{4})$/,
		},
	},

	/**
	 * Contraintes pour une danse
	 */

	danse: {
		/**
		 * Nom de la danse
		 */
		titre: {
			longueurMin: 1,
			longueurMax: 50,
		},
		/**
		 * Prénom et nom du ou des chorégraphes
		 */
		choregraphe: {
			longueurMin: 8,
			longueurMax: 255,
		},
		/**
		 * Musique
		 */
		musique: {
			longueurMin: 1,
			longueurMax: 255,
		},
		/**
		 * Détails des "Tags" et "Restarts"
		 */
		detailsTag: {
			longueurMin: 8,
			longueurMax: 555,
		},
		/**
		 * Détails du nombre de comptes
		 */
		nbComptes: {
			min: 8,
			max: 255,
		},
		/**
		 * Détails du nombre de murs
		 */
		nbMurs: {
			min: 1,
			max: 4,
		},
	},
};
