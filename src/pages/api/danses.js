import { obtenirQueryChaine, obtenirQueryEntier, repondreErr, repondreJson } from "../../lib/apiUtils.mjs";
import Bd from "../../lib/bd.mjs";

const modesDeTri = ["score", "titre", "ajout", "difficulte", "comptes", "murs"];

/**
 * Requête pour chercher des danses
 *
 * @type {import("astro").APIRoute}
 */
export async function GET({ url }) {
	const motsCles = obtenirQueryChaine(url, "motsCles", "", 50);
	const trierPar = obtenirQueryChaine(url, "trierPar", "score", 50);
	const page = obtenirQueryEntier(url, "page", 1, 1) - 1;
	const limite = obtenirQueryEntier(url, "nbResultats", 20, 1, 20);
	const desc = obtenirQueryEntier(url, "desc", 0, 0, 1);

	if (!modesDeTri.includes(trierPar)) {
		return repondreErr("Mode de tri invalide");
	}

	let retour = {
		resultats: await Bd.chercherDanses(motsCles, trierPar, desc, page, limite),
	};

	return repondreJson(retour);
}
