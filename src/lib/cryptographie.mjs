// importation du paquet NodeJS pour la cryptographie:
import { randomBytes } from "node:crypto";

// importation du paquet NPM pour argon2-rs:
import { hash, verify } from "@node-rs/argon2";

/**
 * Génère une chaîne aléatoire selon une entropie donnée.
 *
 * @param {number} octets Nombre d'octets d'entropie
 * @returns une chaîne aléatoire cryptographiquement sécuritaire
 */
export const chaineAleatoire = (octets = 64) =>
	randomBytes(octets).toString("base64url");

/**
 * Options à utiliser pour le chiffrement argon2
 *
 * @type {import("@node-rs/argon2").Options}
 */
const optionsArgon2 = {
	timeCost: 6,
	outputLen: 64,
};

/**
 * Permet de hacher un mot de passe en clair avec Argon2id
 *
 * @param {String} mdp mot de passe en clair à hacher
 * @returns {Promise<String>} le mot de passe haché
 */
export const hacherMdp = async mdp =>
	await hash(mdp, optionsArgon2);

/**
 * Permet de valider si un mot de passe en clair donné est identique à un
 * mot de passe précédemment haché avec hacherMdp
 *
 * @param {String} mdp mot de passe en clair à valider
 * @param {String} mdpConnu mot de passe haché à partir duquel on valide
 * @returns {Promise<Boolean>} vrai si le mot de passe est identique
 */
export const validerMdp = async (mdp, mdpConnu) =>
	await verify(mdpConnu, mdp, optionsArgon2);
