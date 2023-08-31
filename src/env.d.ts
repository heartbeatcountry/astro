import ModeleSession from "./lib/models/session.mjs";

/// <reference types="astro/client" />
declare namespace App {
	interface Locals {
		/**
		 * Référence à la session de l'utilisateur connecté
		 */
		session: ModeleSession;
	}
}
