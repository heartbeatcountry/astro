/* eslint-disable no-control-regex */
/**
 * Expression rationnelle pour valider les adresses courriel (RFC 6521)
 */
const regexCourriel = new RegExp(
	// eslint-disable-next-line no-useless-escape
	/^(?<localPart>(?<dotString>[0-9a-z!#$%&'*+-\/=?^_`\{|\}~\u{80}-\u{10FFFF}]+(\.[0-9a-z!#$%&'*+-\/=?^_`\{|\}~\u{80}-\u{10FFFF}]+)*)|(?<quotedString>"([\x20-\x21\x23-\x5B\x5D-\x7E\u{80}-\u{10FFFF}]|\\[\x20-\x7E])*"))(?<!.{64,})@(?<domainOrAddressLiteral>(?<addressLiteral>\[((?<IPv4>\d{1,3}(\.\d{1,3}){3})|(?<IPv6Full>IPv6:[0-9a-f]{1,4}(:[0-9a-f]{1,4}){7})|(?<IPv6Comp>IPv6:([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,5})?::([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,5})?)|(?<IPv6v4Full>IPv6:[0-9a-f]{1,4}(:[0-9a-f]{1,4}){5}:\d{1,3}(\.\d{1,3}){3})|(?<IPv6v4Comp>IPv6:([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,3})?::([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,3}:)?\d{1,3}(\.\d{1,3}){3})|(?<generalAddressLiteral>[a-z0-9-]*[[a-z0-9]:[\x21-\x5A\x5E-\x7E]+))\])|(?<Domain>(?!.{256,})(([0-9a-z\u{80}-\u{10FFFF}]([0-9a-z-\u{80}-\u{10FFFF}]*[0-9a-z\u{80}-\u{10FFFF}])?))(\.([0-9a-z\u{80}-\u{10FFFF}]([0-9a-z-\u{80}-\u{10FFFF}]*[0-9a-z\u{80}-\u{10FFFF}])?))*))$/iu
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
			longueurMin: 0,
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
			longueurMin: 0,
			longueurMax: 128,
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
			min: 0,
			max: 4,
		},
	},
	/**
	 * Contraintes pour une appréciation
	 */
	appreciation: {
		/**
		 * Note accordée par l'usager
		 */
		note: {
			min: 1,
			max: 5,
		},
	}
};
