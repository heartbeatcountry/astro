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
		//return repondreErr("Vous devez être connecté", 401);
	}

	/*
	await Bd.modifierAppreciation({
		usager: usager.id,
		danse: danse.id,
		note,
	});
	*/

	console.log({ idDanse, note });

	return repondreJson({
		message: "Note modifiée avec succès",
	});
}
