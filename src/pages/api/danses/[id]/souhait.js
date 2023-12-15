import {
	obtenirQueryChaine,
	obtenirQueryEntier,
	repondreErr,
	repondreJson,
} from "../../../../lib/apiUtils.mjs";
import Bd from "../../../../lib/bd.mjs";

/**
 * Requête pour ajouter une danse dans les danses souhaitées par un utilisateur
 *
 * @type {import("astro").APIRoute}
 */
export async function POST(apiRoute) {
	const idDanse = apiRoute.params.id.trim();
	const usager = apiRoute.locals["usager"];

	if (!usager) {
		return repondreErr("Vous devez être connecté", 401);
	}

	const danse = await Bd.obtenirDetailsDanse(idDanse);

	if (!danse) {
		return repondreErr("Danse introuvable", 404);
	}

	try {
		await Bd.ajoutDanseSouhaitee(idDanse, usager);
	} catch (erreur) {
		return repondreErr(erreur.message, 404);
	}

	return repondreJson(
		{
			message: "Danse ajoutée avec succès.",
		},
		201
	);
}

/**
 * Requête pour retirer une danse des danses souhaitées par un utilisateur
 *
 * @type {import("astro").APIRoute}
 */
export async function DELETE(apiRoute) {
	const idDanse = apiRoute.params.id.trim();
	const usager = apiRoute.locals["usager"];

	if (!usager) {
		return repondreErr("Vous devez être connecté", 401);
	}

	try {
		await Bd.supprimerDanseSouhaitee(idDanse, usager);
	} catch (erreur) {
		return repondreErr(erreur.message, 404);
	}

	return repondreJson({
		message: "Danse souhaitée supprimée avec succès",
	});
}
