// importation du paquet NodeJS pour la cryptographie:
import { randomBytes } from "node:crypto";

/**
 * Génère une chaîne aléatoire selon une entropie donnée.
 *
 * @param {number} octets Nombre d'octets d'entropie
 * @returns une chaîne aléatoire cryptographiquement sécuritaire
 */
export const chaineAleatoire = (octets = 64) =>
	randomBytes(octets).toString("base64url");
