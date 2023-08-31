import { sequence, defineMiddleware } from "astro/middleware";
import Session from "../lib/session.mjs";


const middlewareSession = defineMiddleware(async (context, next) => {
	const session = await Session.obtenirDepuisCookie(context.cookies);
	context.locals.session = session;
	context.locals.estConnecte = session && !session.estExpiree;
	return next();
});

export const onRequest = sequence(middlewareSession);
