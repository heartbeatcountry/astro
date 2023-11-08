import { obtenirQueryChaine, obtenirQueryEntier, repondreErr, repondreJson } from "../../../../lib/apiUtils.mjs";
import Bd from "../../../../lib/bd.mjs";

/**
 *
 *
 * @type {import("astro").APIRoute}
 */
export async function PUT(apiRoute) {
	const { url } = apiRoute;
	const idDanse = apiRoute.params.id.trim();
	const note = obtenirQueryEntier(url, "note", 1, 1, 5);

	const usager = apiRoute.locals["usager"];

	if (!usager) {
		return repondreErr("Vous devez être connecté", 401);
	}

	const danse = await Bd.obtenirDetailsDanse(idDanse);

	if (!danse) {
		return repondreErr("Danse introuvable", 404);
	}

	let nouvMoyenne = 0;
	try {
		nouvMoyenne = await Bd.modifierAppreciation(note, idDanse, usager);
	} catch (erreur) {
		console.error(erreur);
		return repondreErr(erreur.message, 404);
	}

	return repondreJson({
		message: "Note modifiée avec succès",
		nouvMoyenne,
	});
}
