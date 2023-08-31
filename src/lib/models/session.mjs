import { Schema, model, ObjectId } from "mongoose";

export const Session = new Schema({
	/**
	 * L'usager à qui appartient la session.
	 * Il est possible d'utiliser Session.populate("usager") pour obtenir les détails de l'usager
	 */
	usager: {
		type: ObjectId,
		ref: 'Usager',
		required: true,
		unique: true,
	},

	/**
	 * Clé publique de la session
	 */
	cle: {
		type: String,
		required: true,
	},

	/**
	 * Date d'expiration de la session
	 */
	dateExpiration: Date,
}, {
	virtuals: {
		/**
		 * Vrai si la session est expirée
		 */
		estExpiree: {
			get() {
				return (new Date()) >= this.dateExpiration
			}
		},
	}
});

export default Session;
