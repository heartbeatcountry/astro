/**
 * Schéma imbriqué représentant un lien
 */

import { Schema } from "mongoose";
import { contraintes } from "../consts.mjs";

/**
 * Validateur pour un URL
 *
 * @param {String} url - url que l'on désire valider
 * @returns {Boolean} vrai si l'URL est valide
 */
const validerUrl = url => {
	try {
		new URL(url);
	} catch {
		return false;
	}
	return true;
};

export const Lien = new Schema({
	titre: {
		type: String,
		trim: true,
		required: true,
		minLength: contraintes.lien.titre.longueurMin,
		maxLength: contraintes.lien.titre.longueurMax,
	},
	url: {
		type: String,
		trim: true,
		required: true,
		validate: [validerUrl, "l'URL du lien est invalide"]
	},
});

export default Lien;
