import { sequence, defineMiddleware } from "astro/middleware";
import Session from "../lib/session.mjs";


/**
 * Middleware qui récupère la session de l'usager depuis ses cookies et injecte
 * le modèle Usager dans chaque route
 */
const middlewareSession = defineMiddleware(async (context, next) => {
	// Récupération de la Session depuis les cookies:
	const session = await Session.obtenirDepuisCookie(context.cookies);

	// Instance de l'usager connecté:
	context.locals.usager = null; // null par défaut (non connecté)

	// Si l'usager est connecté, on expose l'instance de Usager:
	if (session && !session.estExpiree) {
		await session.populate("usager");
		context.locals.usager = session.usager;
	}

	return next();
});

export const onRequest = sequence(middlewareSession);
