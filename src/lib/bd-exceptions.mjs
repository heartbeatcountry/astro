import { mongo } from "mongoose";
export const { MongoServerError } = mongo;

/**
 * Erreur lancée lorsqu'un utilisateur existe déjà
 */
export class ErrUtilisateurExiste extends MongoServerError { }
